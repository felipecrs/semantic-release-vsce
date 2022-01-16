import test from 'ava';
import { fake, stub } from 'sinon';
import rewiremock from './utils/rewiremock';

const logger = {
  log: fake()
};

test('resolves', async t => {
  const verify = rewiremock('../lib/verify', {
    './verify-auth': stub().resolves(),
    './verify-pkg': stub().resolves()
  });

  await t.notThrowsAsync(() => verify(logger));
});

test('rejects with verify-auth', async t => {
  const verify = rewiremock('../lib/verify', {
    './verify-auth': stub().rejects(),
    './verify-pkg': stub().resolves()
  });

  await t.throwsAsync(() => verify(logger));
});

test('rejects with verify-pkg', async t => {
  const verify = rewiremock('../lib/verify', {
    './verify-auth': stub().resolves(),
    './verify-pkg': stub().rejects()
  });

  await t.throwsAsync(() => verify(logger));
});
