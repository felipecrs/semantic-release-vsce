import avaTest from 'ava';
import esmock from 'esmock';
import path from 'node:path';
import { fake, stub } from 'sinon';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

const semanticReleasePayload = {
  nextRelease: {
    version: '1.0.0',
  },
  logger: {
    log: fake(),
  },
  cwd: process.cwd(),
};

const pluginConfig = {
  packageVsix: 'test.vsix',
};

test.beforeEach((t) => {
  t.context.stubs = {
    verifyVsceStub: stub().resolves(),
    vscePublishStub: stub().resolves(),
    vscePrepareStub: stub().resolves(),
  };
});

test.afterEach((t) => {
  for (const key of Object.keys(t.context.stubs)) {
    t.context.stubs[key].resetHistory();
  }
});

test('verifyConditions', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { verifyConditions } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
  });

  await verifyConditions(pluginConfig, semanticReleasePayload);

  t.true(
    verifyVsceStub.calledOnceWith(pluginConfig, {
      logger: semanticReleasePayload.logger,
      cwd: semanticReleasePayload.cwd,
    }),
  );
});

test('prepare and unverified', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
  });

  await prepare(pluginConfig, semanticReleasePayload);

  t.true(
    verifyVsceStub.calledOnceWith(pluginConfig, {
      logger: semanticReleasePayload.logger,
      cwd: semanticReleasePayload.cwd,
    }),
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
  const { prepare, verifyConditions } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
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
  const { publish } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
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
  const { publish, verifyConditions } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
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
  const { prepare, publish, verifyConditions } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
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
  const { prepare, publish, verifyConditions } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
  });

  await verifyConditions(
    { ...pluginConfig, publish: false },
    semanticReleasePayload,
  );
  await prepare({ ...pluginConfig, publish: false }, semanticReleasePayload);
  await publish({ ...pluginConfig, publish: false }, semanticReleasePayload);

  t.true(vscePublishStub.notCalled);
});

test('it can publish when `OVSX_PAT` is present but `VSCE_PAT` is missing', async (t) => {
  const token = 'abc123';
  stub(process, 'env').value({
    OVSX_PAT: token,
  });
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { prepare, publish, verifyConditions } = await esmock('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
  });

  await verifyConditions({ ...pluginConfig }, semanticReleasePayload);
  await prepare({ ...pluginConfig }, semanticReleasePayload);
  await publish({ ...pluginConfig }, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    undefined,
    semanticReleasePayload.logger,
    semanticReleasePayload.cwd,
  ]);
});

test('expand globs if publishPackagePath is set', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish } = await esmock.p('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
    glob: {
      glob: stub().resolves(['package1.vsix', 'package2.vsix']),
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

test('publishes an extension in a non-root folder', async (t) => {
  const { verifyVsceStub, vscePrepareStub, vscePublishStub } = t.context.stubs;
  const { publish } = await esmock.p('../index.js', {
    '../lib/verify.js': {
      verify: verifyVsceStub,
    },
    '../lib/prepare.js': {
      prepare: vscePrepareStub,
    },
    '../lib/publish.js': {
      publish: vscePublishStub,
    },
    glob: {
      glob: stub().resolves(['package1.vsix', 'package2.vsix']),
    },
  });

  const pluginConfig = {
    packageRoot: './vscode-extension',
  };
  const resolvedCwd = path.resolve(
    `${semanticReleasePayload.cwd}/vscode-extension`,
  );

  await publish(pluginConfig, semanticReleasePayload);

  t.true(verifyVsceStub.calledOnce);
  t.true(vscePrepareStub.calledOnce);
  t.deepEqual(vscePublishStub.getCall(0).args, [
    semanticReleasePayload.nextRelease.version,
    undefined,
    semanticReleasePayload.logger,
    resolvedCwd,
  ]);
});
