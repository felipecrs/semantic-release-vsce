const test = require('ava');
const sinon = require('sinon');
const SemanticReleaseError = require('@semantic-release/error');

test('OVSX_PAT is not set', async (t) => {
  const logger = {
    log: sinon.fake(),
  };

  const verifyOvsxAuth = require('../lib/verify-ovsx-auth');

  await t.notThrowsAsync(() => verifyOvsxAuth(logger));
  t.true(logger.log.calledTwice);
});

test('OVSX_PAT is set', async (t) => {
  const logger = {
    log: sinon.fake(),
  };

  sinon.stub(process, 'env').value({
    OVSX_PAT: 'abc123',
  });

  const verifyOvsxAuth = require('../lib/verify-ovsx-auth');

  await t.notThrowsAsync(() => verifyOvsxAuth(logger));
  t.true(logger.log.calledOnce);
});

test('OVSX_PAT is invalid', async (t) => {
  const logger = {
    log: sinon.fake(),
  };

  sinon.stub(process, 'env').value({
    OVSX_PAT: '',
  });

  const verifyOvsxAuth = require('../lib/verify-ovsx-auth');

  await t.throwsAsync(() => verifyOvsxAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDOVSXPAT',
  });
});
