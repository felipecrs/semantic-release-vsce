import avaTest from 'ava';
import { fake, stub } from 'sinon';
import esmock from 'esmock';
import path from 'node:path';
import process from 'node:process';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

const logger = {
  log: fake(),
};
// eslint-disable-next-line unicorn/prevent-abbreviations
const localDir = path.resolve(import.meta.dirname, '../lib');
const cwd = process.cwd();

test.beforeEach((t) => {
  t.context.stubs = {
    execaStub: stub().resolves(),
  };
});

test.afterEach((t) => {
  t.context.stubs.execaStub.resetHistory();
});

test('packageVsix is disabled', async (t) => {
  const { execaStub } = t.context.stubs;
  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
  });

  const version = '1.0.0';
  await prepare(version, false, logger);

  t.true(execaStub.notCalled);
});

test('packageVsix is not specified', async (t) => {
  const { execaStub } = t.context.stubs;
  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
  });

  const version = '1.0.0';
  await prepare(version, undefined, logger);

  t.true(execaStub.notCalled);
});

test('packageVsix is a string', async (t) => {
  const { execaStub } = t.context.stubs;
  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
  });

  const version = '1.0.0';
  const packageVsix = 'test.vsix';
  const packagePath = packageVsix;
  const result = await prepare(version, packageVsix, logger, cwd);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['package', version, '--no-git-tag-version', '--out', packagePath],
    {
      stdio: 'inherit',
      preferLocal: true,
      localDir,
      cwd,
    },
  ]);
});

test('packageVsix is true', async (t) => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packageVsix = true;
  const packagePath = `${name}-${version}.vsix`;

  const result = await prepare(version, packageVsix, logger, cwd);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['package', version, '--no-git-tag-version', '--out', packagePath],
    { stdio: 'inherit', preferLocal: true, localDir, cwd },
  ]);
});

test('packageVsix is not set but OVSX_PAT is', async (t) => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        name,
      }),
    },
  });

  stub(process, 'env').value({
    OVSX_PAT: 'abc123',
  });

  const version = '1.0.0';
  const packageVsix = undefined;
  const packagePath = `${name}-${version}.vsix`;

  const result = await prepare(version, packageVsix, logger, cwd);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['package', version, '--no-git-tag-version', '--out', packagePath],
    { stdio: 'inherit', preferLocal: true, localDir, cwd },
  ]);
});

test('packageVsix when target is set', async (t) => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const target = 'linux-x64';

  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        name,
      }),
    },
  });

  const version = '1.0.0';

  const packagePath = `${name}-${target}-${version}.vsix`;

  stub(process, 'env').value({
    VSCE_TARGET: target,
  });

  const result = await prepare(version, true, logger, cwd);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    [
      'package',
      version,
      '--no-git-tag-version',
      '--out',
      packagePath,
      '--target',
      target,
    ],
    { stdio: 'inherit', preferLocal: true, localDir, cwd },
  ]);
});

test('packageVsix when target is set to universal', async (t) => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const { prepare } = await esmock('../lib/prepare.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = `${name}-${version}.vsix`;

  stub(process, 'env').value({
    VSCE_TARGET: 'universal',
  });

  const result = await prepare(version, true, logger, cwd);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['package', version, '--no-git-tag-version', '--out', packagePath],
    { stdio: 'inherit', preferLocal: true, localDir, cwd },
  ]);
});
