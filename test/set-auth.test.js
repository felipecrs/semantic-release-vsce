const test = require('ava');
const sinon = require('sinon');
const SemanticReleaseError = require('@semantic-release/error');
const setAuth = require('../lib/set-auth');

const logger = {
  log: sinon.fake()
};

test('VSCE_TOKEN is set', async t => {
  process.env.VSCE_TOKEN = 'abc123';
  await t.notThrowsAsync(() => setAuth(logger));
});

test('VSCE_TOKEN is not set', async t => {
  delete process.env.VSCE_TOKEN;
  await t.throwsAsync(() => setAuth(logger), { instanceOf: SemanticReleaseError });
});
