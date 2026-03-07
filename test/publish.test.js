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
    vscePublishStub: stub().resolves(),
    ovsxPublishStub: stub().resolves(),
  };
});

test.afterEach((t) => {
  t.context.stubs.vscePublishStub.resetHistory();
  t.context.stubs.ovsxPublishStub.resetHistory();
});

test('publish to vs marketplace with VSCE_PAT', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    version,
    gitTagVersion: false,
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish to vs marketplace with VSCE_AZURE_CREDENTIAL=true', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: undefined,
    azureCredential: true,
    packagePath: [packagePath],
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish to vs marketplace with VSCE_AZURE_CREDENTIAL=1', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: undefined,
    azureCredential: true,
    packagePath: [packagePath],
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish with packagePath', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    packagePath: [packagePath],
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish with multiple packagePath', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    packagePath,
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish with target', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    version,
    gitTagVersion: false,
    targets: [target],
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish with VSCE_PRE_RELEASE enabled and no packagePath', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
    VSCE_PRE_RELEASE: 'true',
  });
  const result = await publish(version, undefined, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    version,
    gitTagVersion: false,
    preRelease: true,
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish with VSCE_PRE_RELEASE enabled and packagePath', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
    VSCE_PRE_RELEASE: 'true',
  });
  const result = await publish(version, packagePath, logger, cwd);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`,
  });
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    packagePath: [packagePath],
  });
  t.true(ovsxPublishStub.notCalled);
});

test('publish to OpenVSX', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.deepEqual(vscePublishStub.getCall(0).args[0], {
    cwd,
    pat: token,
    azureCredential: false,
    packagePath: [packagePath],
  });
  t.deepEqual(ovsxPublishStub.getCall(0).args[0], {
    pat: token,
    packagePath: [packagePath],
  });
});

test('publish to OpenVSX only', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.true(vscePublishStub.notCalled);
  t.true(ovsxPublishStub.calledOnce);
  t.deepEqual(ovsxPublishStub.getCall(0).args[0], {
    pat: token,
    packagePath: [packagePath],
  });
});

test('should not publish when neither vsce nor ovsx personal access token is configured', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.true(vscePublishStub.notCalled);
  t.true(ovsxPublishStub.notCalled);
});

test('should not publish if no token and VSCE_AZURE_CREDENTIAL=false', async (t) => {
  const { vscePublishStub, ovsxPublishStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const { publish } = await esmock('../lib/publish.js', {
    '@vscode/vsce': {
      publish: vscePublishStub,
    },
    ovsx: {
      publish: ovsxPublishStub,
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
  t.true(vscePublishStub.notCalled);
  t.true(ovsxPublishStub.notCalled);
});
