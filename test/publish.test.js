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

test('publish', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = rewiremock('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token
  });
  const result = await publish(version, undefined, undefined, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', version, '--no-git-tag-version'], { stdio: 'inherit' }]);
});

test('publish with packagePath', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = rewiremock('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token
  });
  const result = await publish(version, packagePath, undefined, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', '--packagePath', packagePath], { stdio: 'inherit' }]);
});

test('publish when yarn is true', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = rewiremock('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token
  });
  const yarn = true;
  const result = await publish(version, undefined, yarn, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', version, '--no-git-tag-version', '--yarn'], { stdio: 'inherit' }]);
});

test('publish with VSCE_PAT and VSCE_TOKEN should prefer VSCE_PAT', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = rewiremock('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token,
    VSCE_TOKEN: token
  });
  const result = await publish(version, undefined, undefined, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', version, '--no-git-tag-version'], { stdio: 'inherit' }]);
});

test('publish to OpenVSX', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = rewiremock('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  const token = 'abc123';
  stub(process, 'env').value({
    OVSX_PAT: token,
    VSCE_TOKEN: token
  });
  const result = await publish(version, packagePath, undefined, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', '--packagePath', packagePath], { stdio: 'inherit' }]);

  // t.deepEqual(result[1], {
  //   name: 'Open VSX Registry',
  //   url: `https://open-vsx.org/extension/${publisher}/${name}/${version}`
  // });
  t.deepEqual(execaStub.getCall(1).args, ['ovsx', ['publish', packagePath], { stdio: 'inherit' }]);
});
