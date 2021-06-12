const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const logger = {
  log: sinon.fake()
};

test.beforeEach(t => {
  t.context.stubs = {
    execaStub: sinon.stub()
  };
});

test.afterEach(t => {
  t.context.stubs.execaStub.resetHistory();
});

test('packageVsix is not specified', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  await prepare(version, undefined, undefined, logger);

  t.true(execaStub.notCalled);
});

test('packageVsix is not specified but yarn is true', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  const yarn = true;
  await prepare(version, undefined, yarn, logger);

  t.true(execaStub.notCalled);
});

test('packageVsix is a string', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  const packageVsix = 'test.vsix';
  await prepare(version, packageVsix, undefined, logger);

  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version', '--out', packageVsix], { stdio: 'inherit' }]);
});

test('packageVsix is true', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  const packageVsix = true;
  await prepare(version, packageVsix, undefined, logger);

  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version'], { stdio: 'inherit' }]);
});

test('packageVsix is true and yarn is true', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = proxyquire('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  const packageVsix = true;
  const yarn = true;
  await prepare(version, packageVsix, yarn, logger);

  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version', '--yarn'], { stdio: 'inherit' }]);
});
