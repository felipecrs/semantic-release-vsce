import avaTest from 'ava';
import { fake, stub } from 'sinon';
import esmock from 'esmock';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

const logger = {
  log: fake(),
};
const cwd = process.cwd();

test.beforeEach((t) => {
  t.context.stubs = {
    execaStub: stub(),
  };
});

test.afterEach((t) => {
  t.context.stubs.execaStub.resetHistory();
});

test('publish to vs marketplace with VSCE_PAT', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token,
  });
  const result = await publish(version, undefined, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['publish', version, '--no-git-tag-version'],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish to vs marketplace with VSCE_AZURE_CREDENTIAL=true', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  stub(process, 'env').value({
    VSCE_AZURE_CREDENTIAL: 'true',
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  const args0 = execaStub.getCall(0).args;
  t.deepEqual(args0, [
    'vsce',
    ['publish', '--packagePath', packagePath, '--azure-credential'],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish to vs marketplace with VSCE_AZURE_CREDENTIAL=1', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  stub(process, 'env').value({
    VSCE_AZURE_CREDENTIAL: '1',
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  const args0 = execaStub.getCall(0).args;
  t.deepEqual(args0, [
    'vsce',
    ['publish', '--packagePath', packagePath, '--azure-credential'],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish with packagePath', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token,
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['publish', '--packagePath', packagePath],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish with multiple packagePath', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = ['test.vsix', 'test2.vsix'];
  const token = 'abc123';
  stub(process, 'env').value({
    VSCE_PAT: token,
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['publish', '--packagePath', ...packagePath],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish with target', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const token = 'abc123';
  const target = 'linux-x64';
  stub(process, 'env').value({
    VSCE_PAT: token,
    VSCE_TARGET: target,
  });
  const result = await publish(version, undefined, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['publish', version, '--no-git-tag-version', '--target', target],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish to OpenVSX', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  const token = 'abc123';
  stub(process, 'env').value({
    OVSX_PAT: token,
    VSCE_PAT: token,
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(execaStub.getCall(0).args, [
    'vsce',
    ['publish', '--packagePath', packagePath],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);

  // t.deepEqual(result[1], {
  //   name: 'Open VSX Registry',
  //   url: `https://open-vsx.org/extension/${publisher}/${name}/${version}`
  // });
  t.deepEqual(execaStub.getCall(1).args, [
    'ovsx',
    ['publish', '--packagePath', packagePath],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('publish to OpenVSX only', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  const token = 'abc123';
  stub(process, 'env').value({
    OVSX_PAT: token,
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Open VSX Registry',
    url: `https://open-vsx.org/extension/${publisher}/${name}/${version}`,
  });
  t.true(execaStub.calledOnce);
  t.deepEqual(execaStub.getCall(0).args, [
    'ovsx',
    ['publish', '--packagePath', packagePath],
    { stdio: 'inherit', preferLocal: true, cwd },
  ]);
});

test('should not publish when neither vsce nor ovsx personal access token is configured', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  stub(process, 'env').value({});

  const result = await publish(version, packagePath, logger, cwd);

  t.falsy(result);
  t.true(execaStub.notCalled);
});

test('should not publish if no token and VSCE_AZURE_CREDENTIAL=false', async (t) => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    execa: {
      execa: execaStub,
    },
    'fs-extra/esm': {
      readJson: stub().resolves({
        publisher,
        name,
      }),
    },
  });

  const version = '1.0.0';
  const packagePath = 'test.vsix';
  stub(process, 'env').value({
    VSCE_AZURE_CREDENTIAL: 'false',
  });

  const result = await publish(version, packagePath, logger, cwd);

  t.falsy(result);
  t.true(execaStub.notCalled);
});
