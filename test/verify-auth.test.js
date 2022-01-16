import test from 'ava';
import { fake, stub } from 'sinon';
import rewiremock from './utils/rewiremock';
import SemanticReleaseError from '@semantic-release/error';

const logger = {
  log: fake()
};

test('VSCE_TOKEN is set', async t => {
  stub(process, 'env').value({
    VSCE_TOKEN: 'abc123'
  });

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).resolves()
  });

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_TOKEN is not set', async t => {
  stub(process, 'env').value({});

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).resolves()
  });

  await t.throwsAsync(() => verifyAuth(logger), { instanceOf: SemanticReleaseError, code: 'ENOVSCEPAT' });
});

test('VSCE_PAT is set', async t => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123'
  });

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).resolves()
  });

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_PAT is not set', async t => {
  stub(process, 'env').value({});

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).resolves()
  });

  await t.throwsAsync(() => verifyAuth(logger), { instanceOf: SemanticReleaseError, code: 'ENOVSCEPAT' });
});

test('VSCE_TOKEN is valid', async t => {
  stub(process, 'env').value({
    VSCE_TOKEN: 'abc123'
  });

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).resolves()
  });

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_TOKEN is invalid', async t => {
  stub(process, 'env').value({
    VSCE_TOKEN: 'abc123'
  });

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).rejects()
  });

  await t.throwsAsync(() => verifyAuth(logger), { instanceOf: SemanticReleaseError, code: 'EINVALIDVSCETOKEN' });
});

test('VSCE_PAT is valid', async t => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123'
  });

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).resolves()
  });

  await t.notThrowsAsync(() => verifyAuth(logger));
});

test('VSCE_PAT is invalid', async t => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123'
  });

  const verifyAuth = rewiremock('../lib/verify-auth', {
    execa: stub().withArgs('vsce', ['verify-pat']).rejects()
  });

  await t.throwsAsync(() => verifyAuth(logger), { instanceOf: SemanticReleaseError, code: 'EINVALIDVSCETOKEN' });
});
