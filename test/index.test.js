const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const semanticReleasePayload = {
  nextRelease: {
    version: '1.0.0'
  },
  logger: {
    log: sinon.fake()
  }
};

const pluginConfig = {
  packageVsix: 'test.vsix',
  yarn: undefined
};

test.beforeEach(t => {
  t.context.stubs = {
    verifyVsceStub: sinon.stub().resolves(),
    vscePublishStub: sinon.stub().resolves(),
    vscePrepareStub: sinon.stub().resolves()
  };
});

test.afterEach(t => {
  Object.keys(t.context.stubs).forEach(key => {
    t.context.stubs[key].resetHistory();
  });
});

test('verifyConditions', async t => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnceWith(semanticReleasePayload.logger));
});

test('prepare and unverified', async t => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub,
    verified: false
  });

  await prepare(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnceWith(semanticReleasePayload.logger));
  t.deepEqual(vscePrepareStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.packageVsix,
    pluginConfig.yarn,
    semanticReleasePayload.logger
  ]);
});

test('prepare and verified', async t => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);
  await prepare(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.deepEqual(vscePrepareStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.packageVsix,
    pluginConfig.yarn,
    semanticReleasePayload.logger
  ]);
});

test('publish that is unverified and unprepared', async t => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub
  });

  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.yarn,
    semanticReleasePayload.logger
  ]);
});

test('publish that is verified but unprepared', async t => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);
  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.yarn,
    semanticReleasePayload.logger
  ]);
});

test('publish that is already verified & prepared', async t => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare, publish, verifyConditions } = proxyquire('../index.js', {
    './lib/verify': verifyVsceStub,
    './lib/publish': vscePublishStub,
    './lib/prepare': vscePrepareStub
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);
  await prepare(pluginConfig, semanticReleasePayload);
  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    pluginConfig.yarn,
    semanticReleasePayload.logger
  ]);
});
