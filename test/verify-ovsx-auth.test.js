const test = require('ava');
const sinon = require('sinon');
const SemanticReleaseError = require('@semantic-release/error');

const logger = {
  log: sinon.fake()
};

test('OVSX_PAT is set', async t => {
  sinon.stub(process, 'env').value({
    OVSX_PAT: 'abc123'
  });

  const verifyOvsxAuth = require('../lib/verify-ovsx-auth');

  await t.notThrowsAsync(() => verifyOvsxAuth(logger));
});

test('OVSX_PAT is invalid', async t => {
  sinon.stub(process, 'env').value({
    OVSX_PAT: ''
  });

  const verifyOvsxAuth = require('../lib/verify-ovsx-auth');

  await t.throwsAsync(() => verifyOvsxAuth(logger), { instanceOf: SemanticReleaseError, code: 'EINVALIDOVSXPAT' });
});
