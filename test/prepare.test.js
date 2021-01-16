const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const logger = {
  log: sinon.fake()
};

test.beforeEach(t => {
  t.context.stubs = {
    execaStub: sinon.stub(),
    updatePackageVersionStub: sinon.stub().resolves()
  };
});

test.afterEach(t => {
  t.context.stubs.execaStub.resetHistory();
  t.context.stubs.updatePackageVersionStub.resetHistory();
});

test('packageVsix is not specified', async t => {
  const { updatePackageVersionStub, execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub,
    './update-package-version': updatePackageVersionStub
  });

  await prepare('1.0.0', undefined, undefined, logger);

  t.true(updatePackageVersionStub.calledOnce);
  t.true(execaStub.notCalled);
});

test('packageVsix is not specified but yarn is true', async t => {
  const { updatePackageVersionStub, execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub,
    './update-package-version': updatePackageVersionStub
  });

  const yarn = true;
  await prepare('1.0.0', undefined, yarn, logger);

  t.true(updatePackageVersionStub.calledOnce);
  t.true(execaStub.notCalled);
});

test('packageVsix is a string', async t => {
  const { updatePackageVersionStub, execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub,
    './update-package-version': updatePackageVersionStub
  });

  const packageVsix = 'test.vsix';
  await prepare('1.0.0', packageVsix, undefined, logger);

  t.true(updatePackageVersionStub.calledOnce);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', '--out', packageVsix], { stdio: 'inherit' }]);
});

test('packageVsix is true', async t => {
  const { updatePackageVersionStub, execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub,
    './update-package-version': updatePackageVersionStub
  });

  const packageVsix = true;
  await prepare('1.0.0', packageVsix, undefined, logger);

  t.true(updatePackageVersionStub.calledOnce);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package'], { stdio: 'inherit' }]);
});

test('packageVsix is true and yarn is true', async t => {
  const { updatePackageVersionStub, execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub,
    './update-package-version': updatePackageVersionStub
  });

  const packageVsix = true;
  const yarn = true;
  await prepare('1.0.0', packageVsix, yarn, logger);

  t.true(updatePackageVersionStub.calledOnce);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', '--yarn'], { stdio: 'inherit' }]);
});
