const test = require('ava');
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

  const verifyAuth = proxyquire('../lib/verify-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .resolves(),
  });

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_PAT is not set', async (t) => {
  sinon.stub(process, 'env').value({});

  const verifyAuth = proxyquire('../lib/verify-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .resolves(),
  });

  await t.throwsAsync(() => verifyAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'ENOVSCEPAT',
  });
});

test('VSCE_PAT is valid', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const verifyAuth = proxyquire('../lib/verify-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .resolves(),
  });

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_PAT is invalid', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const verifyAuth = proxyquire('../lib/verify-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .rejects(),
  });

  await t.throwsAsync(() => verifyAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDVSCETOKEN',
  });
});
