const SemanticReleaseError = require('@semantic-release/error');
const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const logger = {
  log: sinon.fake(),
};
const cwd = process.cwd();

test('resolves', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().resolves(),
    './verify-vsce-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().resolves(),
    './utils': {
      isVscePublishEnabled: sinon.stub().returns(true),
      isOvsxPublishEnabled: sinon.stub().returns(true),
    },
  });

  await t.notThrowsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-pkg', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().rejects(),
    './verify-target': sinon.stub().resolves(),
    './verify-vsce-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-target', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().rejects(),
    './verify-vsce-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-auth', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().resolves(),
    './verify-vsce-auth': sinon.stub().rejects(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-ovsx-auth', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().resolves(),
    './verify-vsce-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().rejects(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('it does not verify the auth tokens if publishing is disabled', async (t) => {
  const stubs = {
    verifyPkgStub: sinon.stub().resolves(),
    verifyTargetStub: sinon.stub().resolves(),
    verifyVsceAuthStub: sinon.stub().resolves(),
    verifyOvsxAuthStub: sinon.stub().resolves(),
  };
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': stubs.verifyPkgStub,
    './verify-target': stubs.verifyTargetStub,
    './verify-vsce-auth': stubs.verifyVsceAuthStub,
    './verify-ovsx-auth': stubs.verifyOvsxAuthStub,
  });

  await verify({ publish: false }, { logger, cwd });

  t.true(stubs.verifyVsceAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
});

test('errors when neither vsce nor ovsx personal access token is configured', async (t) => {
  const stubs = {
    verifyPkgStub: sinon.stub().resolves(),
    verifyTargetStub: sinon.stub().resolves(),
    verifyVsceAuthStub: sinon.stub().resolves(),
    verifyOvsxAuthStub: sinon.stub().resolves(),
    utilsStub: {
      isVscePublishEnabled: sinon.stub().returns(false),
      isOvsxPublishEnabled: sinon.stub().returns(false),
    },
  };
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': stubs.verifyPkgStub,
    './verify-target': stubs.verifyTargetStub,
    './verify-vsce-auth': stubs.verifyVsceAuthStub,
    './verify-ovsx-auth': stubs.verifyOvsxAuthStub,
    './utils': stubs.utilsStub,
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPAT',
  });
  t.true(stubs.verifyVsceAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
});

test('verify vsce only', async (t) => {
  const stubs = {
    verifyPkgStub: sinon.stub().resolves(),
    verifyTargetStub: sinon.stub().resolves(),
    verifyVsceAuthStub: sinon.stub().resolves(),
    verifyOvsxAuthStub: sinon.stub().resolves(),
    utilsStub: {
      isVscePublishEnabled: sinon.stub().returns(true),
      isOvsxPublishEnabled: sinon.stub().returns(false),
    },
    logger: {
      log: sinon.fake(),
    },
  };
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': stubs.verifyPkgStub,
    './verify-target': stubs.verifyTargetStub,
    './verify-vsce-auth': stubs.verifyVsceAuthStub,
    './verify-ovsx-auth': stubs.verifyOvsxAuthStub,
    './utils': stubs.utilsStub,
  });

  await verify({}, { logger: stubs.logger, cwd });
  t.true(stubs.verifyVsceAuthStub.calledOnce);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
  t.true(stubs.logger.log.calledOnce);
});

test('verify ovsx only', async (t) => {
  const stubs = {
    verifyPkgStub: sinon.stub().resolves(),
    verifyTargetStub: sinon.stub().resolves(),
    verifyVsceAuthStub: sinon.stub().resolves(),
    verifyOvsxAuthStub: sinon.stub().resolves(),
    utilsStub: {
      isVscePublishEnabled: sinon.stub().returns(false),
      isOvsxPublishEnabled: sinon.stub().returns(true),
    },
    logger: {
      log: sinon.fake(),
    },
  };
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': stubs.verifyPkgStub,
    './verify-target': stubs.verifyTargetStub,
    './verify-vsce-auth': stubs.verifyVsceAuthStub,
    './verify-ovsx-auth': stubs.verifyOvsxAuthStub,
    './utils': stubs.utilsStub,
  });

  await verify({}, { logger: stubs.logger, cwd });
  t.true(stubs.verifyVsceAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.calledOnce);
  t.true(stubs.logger.log.calledOnce);
});
