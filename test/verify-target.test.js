import SemanticReleaseError from '@semantic-release/error';
import avaTest from 'ava';
import esmock from 'esmock';
import { stub } from 'sinon';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

test('VSCE_TARGET is not set', async (t) => {
  const vscePackage = stub().returns({
    Targets: new Map(),
  });
  const { verifyTarget } = await esmock('../lib/verify-target.js', {
    '@vscode/vsce/out/package.js': vscePackage,
  });

  await t.notThrowsAsync(() => verifyTarget());
});

test('VSCE_TARGET is valid', async (t) => {
  stub(process, 'env').value({
    VSCE_TARGET: 'linux-x64',
  });

  const { verifyTarget } = await import('../lib/verify-target.js');

  await t.notThrowsAsync(() => verifyTarget());
});

test('VSCE_TARGET is empty', async (t) => {
  const vscePackage = stub().returns({
    Targets: new Map(),
  });
  const { verifyTarget } = await esmock('../lib/verify-target.js', {
    '@vscode/vsce/out/package.js': vscePackage,
  });
  stub(process, 'env').value({
    VSCE_TARGET: '',
  });

  t.is(await verifyTarget(), undefined);
});

test('VSCE_TARGET is unsupported', async (t) => {
  stub(process, 'env').value({
    VSCE_TARGET: 'whatever-x64',
  });
  const { verifyTarget } = await import('../lib/verify-target.js');

  await t.throwsAsync(() => verifyTarget(), {
    instanceOf: SemanticReleaseError,
    code: 'EUNSUPPORTEDVSCETARGET',
  });
});

test('VSCE_TARGET is universal', async (t) => {
  stub(process, 'env').value({
    VSCE_TARGET: 'universal',
  });

  const { verifyTarget } = await import('../lib/verify-target.js');

  await t.notThrowsAsync(() => verifyTarget());
});
