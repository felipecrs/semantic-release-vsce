const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const SemanticReleaseError = require('@semantic-release/error');

test('package.json is found', async (t) => {
  const name = 'test';
  const publisher = 'tester';

  const verifyPkg = proxyquire('../lib/verify-pkg', {
    fs: {
      existsSync: sinon.stub().returns(true),
    },
    'fs-extra': {
      readJson: sinon.stub().returns({
        name,
        publisher,
      }),
    },
  });

  await t.notThrowsAsync(() => verifyPkg());
});

test('package.json is not found', async (t) => {
  const name = 'test';
  const publisher = 'tester';

  const verifyPkg = proxyquire('../lib/verify-pkg', {
    fs: {
      existsSync: sinon.stub().returns(false),
    },
    'fs-extra': {
      readJson: sinon.stub().returns({
        name,
        publisher,
      }),
    },
  });

  await t.throwsAsync(() => verifyPkg(), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPKG',
  });
});

test('package is valid', async (t) => {
  const name = 'test';
  const publisher = 'tester';
  const verifyPkg = proxyquire('../lib/verify-pkg', {
    fs: {
      existsSync: sinon.stub().returns(true),
    },
    'fs-extra': {
      readJson: sinon.stub().returns({
        publisher,
        name,
      }),
    },
  });

  await t.notThrowsAsync(() => verifyPkg());
});

test('package is invalid', async (t) => {
  const verifyPkg = proxyquire('../lib/verify-pkg', {
    fs: {
      existsSync: sinon.stub().returns(true),
    },
    'fs-extra': {
      readJson: sinon.stub().rejects(),
    },
  });

  await t.throwsAsync(() => verifyPkg(), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDPKG',
  });
});

test('package is missing name', async (t) => {
  const publisher = 'tester';
  const verifyPkg = proxyquire('../lib/verify-pkg', {
    fs: {
      existsSync: sinon.stub().returns(true),
    },
    'fs-extra': {
      readJson: sinon.stub().returns({
        publisher,
      }),
    },
  });

  await t.throwsAsync(() => verifyPkg(), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPKGNAME',
  });
});

test('package is missing publisher', async (t) => {
  const name = 'test';
  const verifyPkg = proxyquire('../lib/verify-pkg', {
    fs: {
      existsSync: sinon.stub().returns(true),
    },
    'fs-extra': {
      readJson: sinon.stub().returns({
        name,
      }),
    },
  });

  await t.throwsAsync(() => verifyPkg(), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPUBLISHER',
  });
});
