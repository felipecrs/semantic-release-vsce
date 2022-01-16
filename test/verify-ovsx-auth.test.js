import test from 'ava';
import { fake, stub } from 'sinon';
import SemanticReleaseError from '@semantic-release/error';
import verifyOvsxAuth from '../lib/verify-ovsx-auth'

const logger = {
  log: fake()
};

test('OVSX_PAT is set', async t => {
  stub(process, 'env').value({
    OVSX_PAT: 'abc123'
  });

  await t.notThrowsAsync(() => verifyOvsxAuth(logger));
});

test('OVSX_PAT is invalid', async t => {
  stub(process, 'env').value({
    OVSX_PAT: ''
  });

  await t.throwsAsync(() => verifyOvsxAuth(logger), { instanceOf: SemanticReleaseError, code: 'EINVALIDOVSXPAT' });
});
