import { stub } from 'sinon';
import test from 'ava';
import rewiremock from './utils/rewiremock';
import SemanticReleaseError from '@semantic-release/error';

test('package.json is found', async t => {
  const name = 'test';
  const publisher = 'tester';

  const verifyPkg = rewiremock('../lib/verify-pkg', {
    fs: {
      existsSync: stub().returns(true)
    },
    'fs-extra': {
      readJson: stub().returns({
        name,
        publisher
      })
    }
  });

  await t.notThrowsAsync(() => verifyPkg());
});

test('package.json is not found', async t => {
  const name = 'test';
  const publisher = 'tester';

  const verifyPkg = rewiremock('../lib/verify-pkg', {
    fs: {
      existsSync: stub().returns(false)
    },
    'fs-extra': {
      readJson: stub().returns({
        name,
        publisher
      })
    }
  });

  await t.throwsAsync(() => verifyPkg(), { instanceOf: SemanticReleaseError, code: 'ENOPKG' });
});

test('package is valid', async t => {
  const name = 'test';
  const publisher = 'tester';
  const verifyPkg = rewiremock('../lib/verify-pkg', {
    fs: {
      existsSync: stub().returns(true)
    },
    'fs-extra': {
      readJson: stub().returns({
        publisher,
        name
      })
    }
  });

  await t.notThrowsAsync(() => verifyPkg());
});

test('package is invalid', async t => {
  const verifyPkg = rewiremock('../lib/verify-pkg', {
    fs: {
      existsSync: stub().returns(true)
    },
    'fs-extra': {
      readJson: stub().rejects()
    }
  });

  await t.throwsAsync(() => verifyPkg(), { instanceOf: SemanticReleaseError, code: 'EINVALIDPKG' });
});

test('package is missing name', async t => {
  const publisher = 'tester';
  const verifyPkg = rewiremock('../lib/verify-pkg', {
    fs: {
      existsSync: stub().returns(true)
    },
    'fs-extra': {
      readJson: stub().returns({
        publisher
      })
    }
  });

  await t.throwsAsync(() => verifyPkg(), { instanceOf: SemanticReleaseError, code: 'ENOPKGNAME' });
});

test('package is missing publisher', async t => {
  const name = 'test';
  const verifyPkg = rewiremock('../lib/verify-pkg', {
    fs: {
      existsSync: stub().returns(true)
    },
    'fs-extra': {
      readJson: stub().returns({
        name
      })
    }
  });

  await t.throwsAsync(() => verifyPkg(), { instanceOf: SemanticReleaseError, code: 'ENOPUBLISHER' });
});
