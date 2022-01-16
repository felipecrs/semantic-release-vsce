import { fake, stub } from 'sinon';
import test from 'ava';
import rewiremock from './utils/rewiremock';

const logger = {
  log: fake()
};

test.beforeEach(t => {
  t.context.stubs = {
    execaStub: stub()
  };
});

test.afterEach(t => {
  t.context.stubs.execaStub.resetHistory();
});

test('packageVsix is not specified', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = rewiremock('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  await prepare(version, undefined, undefined, logger);

  t.true(execaStub.notCalled);
});

test('packageVsix is not specified but yarn is true', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = rewiremock('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  const yarn = true;
  await prepare(version, undefined, yarn, logger);

  t.true(execaStub.notCalled);
});

test('packageVsix is a string', async t => {
  const { execaStub } = t.context.stubs;
  const prepare = rewiremock('../lib/prepare', {
    execa: execaStub
  });

  const version = '1.0.0';
  const packageVsix = 'test.vsix';
  const packagePath = packageVsix;
  const result = await prepare(version, packageVsix, undefined, logger);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version', '--out', packagePath], { stdio: 'inherit' }]);
});

test('packageVsix is true', async t => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const prepare = rewiremock('../lib/prepare', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        name
      })
    }
  });

  const version = '1.0.0';
  const packageVsix = true;
  const packagePath = `${name}-${version}.vsix`;

  const result = await prepare(version, packageVsix, undefined, logger);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version', '--out', packagePath], { stdio: 'inherit' }]);
});

test('packageVsix is true and yarn is true', async t => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const prepare = rewiremock('../lib/prepare', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        name
      })
    }
  });

  const version = '1.0.0';
  const packageVsix = true;
  const yarn = true;
  const packagePath = `${name}-${version}.vsix`;

  const result = await prepare(version, packageVsix, yarn, logger);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version', '--out', packagePath, '--yarn'], { stdio: 'inherit' }]);
});

test('packageVsix is not set but OVSX_PAT is', async t => {
  const { execaStub } = t.context.stubs;
  const name = 'test';

  const prepare = rewiremock('../lib/prepare', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        name
      })
    }
  });

  stub(process, 'env').value({
    OVSX_PAT: 'abc123'
  });

  const version = '1.0.0';
  const packageVsix = undefined;
  const packagePath = `${name}-${version}.vsix`;

  const result = await prepare(version, packageVsix, undefined, logger);

  t.deepEqual(result, packagePath);
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['package', version, '--no-git-tag-version', '--out', packagePath], { stdio: 'inherit' }]);
});
