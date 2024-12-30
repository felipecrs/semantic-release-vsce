import avaTest from 'ava';
import SemanticReleaseError from '@semantic-release/error';
import { stub } from 'sinon';
import esmock from 'esmock';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

const cwd = process.cwd();

test('package.json is found', async (t) => {
  const name = 'test';
  const publisher = 'tester';

  const { verifyPackage } = await esmock('../lib/verify-package.js', {
    'fs-extra/esm': {
      pathExists: stub().resolves(true),
      readJson: stub().resolves({
        name,
        publisher,
      }),
    },
  });

  await t.notThrowsAsync(() => verifyPackage(cwd));
});

test('package.json is not found', async (t) => {
  const name = 'test';
  const publisher = 'tester';

  const { verifyPackage } = await esmock('../lib/verify-package.js', {
    'fs-extra/esm': {
      pathExists: stub().resolves(false),
      readJson: stub().resolves({
        name,
        publisher,
      }),
    },
  });

  await t.throwsAsync(() => verifyPackage(cwd), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPKG',
  });
});

test('package is valid', async (t) => {
  const name = 'test';
  const publisher = 'tester';
  const { verifyPackage } = await esmock('../lib/verify-package.js', {
    'fs-extra/esm': {
      pathExists: stub().resolves(true),
      readJson: stub().resolves({
        name,
        publisher,
      }),
    },
  });

  await t.notThrowsAsync(() => verifyPackage(cwd));
});

test('package is invalid', async (t) => {
  const { verifyPackage } = await esmock('../lib/verify-package.js', {
    'fs-extra/esm': {
      pathExists: stub().resolves(true),
      readJson: stub().rejects(),
    },
  });

  await t.throwsAsync(() => verifyPackage(cwd), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDPKG',
  });
});

test('package is missing name', async (t) => {
  const publisher = 'tester';
  const { verifyPackage } = await esmock('../lib/verify-package.js', {
    'fs-extra/esm': {
      pathExists: stub().resolves(true),
      readJson: stub().resolves({
        publisher,
      }),
    },
  });

  await t.throwsAsync(() => verifyPackage(cwd), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPKGNAME',
  });
});

test('package is missing publisher', async (t) => {
  const name = 'test';
  const { verifyPackage } = await esmock('../lib/verify-package.js', {
    'fs-extra/esm': {
      pathExists: stub().resolves(true),
      readJson: stub().resolves({
        name,
      }),
    },
  });

  await t.throwsAsync(() => verifyPackage(cwd), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPUBLISHER',
  });
});
