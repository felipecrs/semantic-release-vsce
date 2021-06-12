const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const logger = {
  log: sinon.fake()
};

test('resolves', async t => {
  const verify = proxyquire('../lib/verify', {
    './verify-auth': sinon.stub().resolves(),
    './verify-pkg': sinon.stub().resolves()
  });

  await t.notThrowsAsync(() => verify(logger));
});

test('rejects with verify-auth', async t => {
  const verify = proxyquire('../lib/verify', {
    './verify-auth': sinon.stub().rejects(),
    './verify-pkg': sinon.stub().resolves()
  });

  await t.throwsAsync(() => verify(logger));
});

test('rejects with verify-pkg', async t => {
  const verify = proxyquire('../lib/verify', {
    './verify-auth': sinon.stub().resolves(),
    './verify-pkg': sinon.stub().rejects()
  });

  await t.throwsAsync(() => verify(logger));
});
