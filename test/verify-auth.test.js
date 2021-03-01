const test = require('ava');
const sinon = require('sinon');
const execa = require('execa');
const SemanticReleaseError = require('@semantic-release/error');
const verifyAuth = require('../lib/verify-auth');

const logger = {
  log: sinon.fake()
};

sinon.stub(execa, 'sync').withArgs('vsce', ['verify-pat', '--pat', process.env.VSCE_TOKEN]).returns();

test('VSCE_TOKEN is set', async t => {
  process.env.VSCE_TOKEN = 'abc123';

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_TOKEN is not set', async t => {
  delete process.env.VSCE_TOKEN;

  await t.throwsAsync(() => verifyAuth(logger), { instanceOf: SemanticReleaseError, code: 'ENOVSCEPAT' });
});

test('VSCE_TOKEN is valid', async t => {
  process.env.VSCE_TOKEN = 'abc123';

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_TOKEN is invalid', async t => {
  process.env.VSCE_TOKEN = 'abc123';
  execa.sync.restore();

  await t.throwsAsync(() => verifyAuth(logger), { instanceOf: SemanticReleaseError, code: 'EINVALIDVSCETOKEN' });
});
