const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const SemanticReleaseError = require('@semantic-release/error');

const logger = {
  log: sinon.fake()
};

test('package.json is found', async t => {
  const verify = proxyquire('../lib/verify', {
    './set-auth': sinon.stub().resolves(),
    './verify-pkg': sinon.stub(),
    'read-pkg-up': sinon.stub().returns({ packageJson: {} })
  });

  await t.notThrowsAsync(() => verify(logger));
});

test('package.json is not found', async t => {
  const verify = proxyquire('../lib/verify', {
    './set-auth': sinon.stub().resolves(),
    './verify-pkg': sinon.stub(),
    'read-pkg-up': sinon.stub().returns({ })
  });

  await t.throwsAsync(() => verify(logger), { instanceOf: SemanticReleaseError });
});
