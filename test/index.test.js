const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const semanticReleasePayload = {
  nextRelease: {
    version: '1.0.0',
  },
  logger: {
    log: sinon.fake(),
  },
  cwd: process.cwd(),
};

const pluginConfig = {
  packageVsix: 'test.vsix',
};

test.beforeEach((t) => {
  t.context.stubs = {
    verifyVsceStub: sinon.stub().resolves(),
    vscePublishStub: sinon.stub().resolves(),
    vscePrepareStub: sinon.stub().resolves(),
  };
});

test.afterEach((t) => {
  Object.keys(t.context.stubs).forEach((key) => {
    t.context.stubs[key].resetHistory();
  });
});

test('verifyConditions', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);

  t.true(
    verifyVsceStub.calledOnceWith(pluginConfig, {
      logger: semanticReleasePayload.logger,
      cwd: semanticReleasePayload.cwd,
    })
  );
});

test('prepare and unverified', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
    verified: false,
  });

  await prepare(pluginConfig, semanticReleasePayload);

  t.true(
    verifyVsceStub.calledOnceWith(pluginConfig, {
      logger: semanticReleasePayload.logger,
      cwd: semanticReleasePayload.cwd,
    })
  );
  t.deepEqual(vscePrepareStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.packageVsix,
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});

test('prepare and verified', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);
  await prepare(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.deepEqual(vscePrepareStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.packageVsix,
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});

test('publish that is unverified and unprepared', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
  });

  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    undefined,
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});

test('publish that is verified but unprepared', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);
  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    undefined,
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});

test('publish that is already verified & prepared', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare, publish, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);
  const packagePath = await prepare(pluginConfig, semanticReleasePayload);
  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    packagePath,
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});

test('it does not publish the package if publishing is disabled', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare, publish, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
  });

  await verifyConditions(
    { ...pluginConfig, publish: false },
    semanticReleasePayload
  );
  await prepare({ ...pluginConfig, publish: false }, semanticReleasePayload);
  await publish({ ...pluginConfig, publish: false }, semanticReleasePayload);

  t.true(vscePublishStub.notCalled);
});

test('expand globs if publishPackagePath is set', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
    glob: {
      sync: sinon.stub().returns(['package1.vsix', 'package2.vsix']),
    },
  });

  const pluginConfig = {
    publishPackagePath: 'package*.vsix',
    packageVsix: false,
  };

  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    ['package1.vsix', 'package2.vsix'],
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});
