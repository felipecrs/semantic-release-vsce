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

test('VSCE_AZURE_CREDENTIALS is set', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_AZURE_CREDENTIALS: true,
  });

  const verifyVsceAuth = proxyquire('../lib/verify-vsce-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['--azure-credential', 'verify-pat'], {
        preferLocal: true,
        cwd,
      })
      .resolves(),
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
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

test('Neither VSCE_PAT or VSCE_AZURE_CREDENTIALS are set', async (t) => {
  const logger = {
    log: sinon.fake(),
  };

  sinon.stub(process, 'env').value({
    VSCE_PAT: '',
  });

  const verifyOvsxAuth = require('../lib/verify-vsce-auth');

  await t.throwsAsync(() => verifyOvsxAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EVSCEAUTHNOTPROVIDED',
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

test('Both VSCE_PAT and VSCE_AZURE_CREDENTIALS set', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_PAT: 'abc123',
    VSCE_AZURE_CREDENTIALS: true,
  });

  const verifyVsceAuth = proxyquire('../lib/verify-vsce-auth', {
    execa: sinon
      .stub()
      .withArgs('vsce', ['verify-pat'], { preferLocal: true, cwd })
      .rejects(),
  });

  await t.throwsAsync(() => verifyVsceAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EVSCEDUPLICATEAUTHPROVIDED',
  });
});
