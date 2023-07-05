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
    './verify-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.notThrowsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-pkg', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().rejects(),
    './verify-target': sinon.stub().resolves(),
    './verify-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-target', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().rejects(),
    './verify-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-auth', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().resolves(),
    './verify-auth': sinon.stub().rejects(),
    './verify-ovsx-auth': sinon.stub().resolves(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-ovsx-auth', async (t) => {
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': sinon.stub().resolves(),
    './verify-target': sinon.stub().resolves(),
    './verify-auth': sinon.stub().resolves(),
    './verify-ovsx-auth': sinon.stub().rejects(),
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('it does not verify the auth tokens if publishing is disabled', async (t) => {
  const stubs = {
    verifyPkgStub: sinon.stub().resolves(),
    verifyTargetStub: sinon.stub().resolves(),
    verifyAuthStub: sinon.stub().resolves(),
    verifyOvsxAuthStub: sinon.stub().resolves(),
  };
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': stubs.verifyPkgStub,
    './verify-target': stubs.verifyTargetStub,
    './verify-auth': stubs.verifyAuthStub,
    './verify-ovsx-auth': stubs.verifyOvsxAuthStub,
  });

  await verify({ publish: false }, { logger, cwd });

  t.true(stubs.verifyAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
});

test('it should handle `ENOVSCEPAT` error when publishing to OpenVSX is enabled', async (t) => {
  const stubs = {
    verifyPkgStub: sinon.stub().resolves(),
    verifyTargetStub: sinon.stub().resolves(),
    verifyAuthStub: sinon
      .stub()
      .rejects(new SemanticReleaseError('message', 'ENOVSCEPAT')),
    verifyOvsxAuthStub: sinon.stub().resolves(),
    utilsStub: { isOvsxEnabled: sinon.stub().returns(true) },
  };
  const verify = proxyquire('../lib/verify', {
    './verify-pkg': stubs.verifyPkgStub,
    './verify-target': stubs.verifyTargetStub,
    './verify-auth': stubs.verifyAuthStub,
    './verify-ovsx-auth': stubs.verifyOvsxAuthStub,
    './utils': stubs.utilsStub,
  });

  await verify({}, { logger, cwd });

  t.deepEqual(stubs.verifyAuthStub.getCall(0).args, [logger, cwd]);
  t.deepEqual(stubs.verifyOvsxAuthStub.getCall(0).args, [logger, cwd]);
});
