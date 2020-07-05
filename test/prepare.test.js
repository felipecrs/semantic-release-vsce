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

  await prepare('1.0.0', undefined, logger);

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
  await prepare('1.0.0', packageVsix, logger);

  t.true(updatePackageVersionStub.calledOnce);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', '--out', packageVsix], { stdio: 'inherit' }]);
});
