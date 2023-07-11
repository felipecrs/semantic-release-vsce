const test = require('ava').serial;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const SemanticReleaseError = require('@semantic-release/error');

const logger = {
  log: sinon.fake(),
};
const cwd = process.cwd();

test('VSCE_PAT is set', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const verifyVsceAuth = proxyquire('../lib/verify-vsce-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .resolves(),
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('VSCE_PAT is not set', async (t) => {
  sinon.stub(process, 'env').value({});

  const verifyVsceAuth = require('../lib/verify-vsce-auth');
  const error = await t.throwsAsync(verifyVsceAuth(logger));
  t.deepEqual(error.code, 'ENOVSCEPAT');
});

test('VSCE_PAT is valid', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const verifyVsceAuth = proxyquire('../lib/verify-vsce-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .resolves(),
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('VSCE_PAT is invalid', async (t) => {
  const logger = {
    log: sinon.fake(),
  };

  sinon.stub(process, 'env').value({
    VSCE_PAT: '',
  });

  const verifyOvsxAuth = require('../lib/verify-vsce-auth');

  await t.throwsAsync(() => verifyOvsxAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDVSCEPAT',
  });
});

test('VSCE_PAT is invalid but not empty', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const verifyVsceAuth = proxyquire('../lib/verify-vsce-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .rejects(),
  });

  await t.throwsAsync(() => verifyVsceAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDVSCEPAT',
  });
});
