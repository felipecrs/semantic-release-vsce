const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');
const SemanticReleaseError = require('@semantic-release/error');

test('VSCE_TARGET is not set', async (t) => {
  const vscePackage = sinon.stub().returns({
    Targets: new Map(),
  });
  const verifyTarget = proxyquire('../lib/verify-target', {
    'vsce/out/package': vscePackage,
  });

  await t.notThrowsAsync(() => verifyTarget());
});

test('VSCE_TARGET is valid', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_TARGET: 'linux-x64',
  });

  const verifyTarget = require('../lib/verify-target');

  await t.notThrowsAsync(() => verifyTarget());
});

test('VSCE_TARGET is empty', async (t) => {
  const vscePackage = sinon.stub().returns({
    Targets: new Map(),
  });
  const verifyTarget = proxyquire('../lib/verify-target', {
    'vsce/out/package': vscePackage,
  });
  sinon.stub(process, 'env').value({
    VSCE_TARGET: '',
  });

  await t.throwsAsync(() => verifyTarget(), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDVSCETARGET',
  });
  t.false(vscePackage.called);
});

test('VSCE_TARGET is unsupported', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_TARGET: 'whatever-x64',
  });
  const verifyTarget = require('../lib/verify-target');

  await t.throwsAsync(() => verifyTarget(), {
    instanceOf: SemanticReleaseError,
    code: 'EUNSUPPORTEDVSCETARGET',
  });
});

test('VSCE_TARGET is universal', async (t) => {
  sinon.stub(process, 'env').value({
    VSCE_TARGET: 'universal',
  });

  const verifyTarget = require('../lib/verify-target');

  await t.notThrowsAsync(() => verifyTarget());
});
