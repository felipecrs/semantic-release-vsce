import avaTest from 'ava';
import { fake, stub } from 'sinon';
import esmock from 'esmock';
import SemanticReleaseError from '@semantic-release/error';
import path from 'node:path';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

// eslint-disable-next-line unicorn/prevent-abbreviations
const localDir = path.resolve(import.meta.dirname, '../lib');
const cwd = process.cwd();

test('OVSX_PAT is set', async (t) => {
  const logger = {
    log: fake(),
  };

  stub(process, 'env').value({
    OVSX_PAT: 'abc123',
  });

  const { verifyOvsxAuth } = await esmock('../lib/verify-ovsx-auth.js', {
    execa: {
      execa: stub()
        .withArgs('ovsx', ['verify-pat'], { preferLocal: true, localDir, cwd })
        .resolves(),
    },
  });

  await t.notThrowsAsync(() => verifyOvsxAuth(logger));
  t.true(logger.log.calledOnce);
});

test('OVSX_PAT is invalid', async (t) => {
  const logger = {
    log: fake(),
  };

  stub(process, 'env').value({
    OVSX_PAT: '',
  });

  const { verifyOvsxAuth } = await import('../lib/verify-ovsx-auth.js');

  await t.throwsAsync(() => verifyOvsxAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EEMPTYOVSXPAT',
  });
});

test('OVSX_PAT is invalid but not empty', async (t) => {
  const logger = {
    log: fake(),
  };

  stub(process, 'env').value({
    OVSX_PAT: 'abc123',
  });

  const { verifyOvsxAuth } = await import('../lib/verify-ovsx-auth.js');

  await t.throwsAsync(() => verifyOvsxAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDOVSXPAT',
  });
});
