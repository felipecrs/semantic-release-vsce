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

test('publish', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = proxyquire('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: sinon.stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const token = 'abc123';
  process.env.VSCE_TOKEN = token;
  const result = await publish(version, undefined, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', version, '--no-git-tag-version'], { stdio: 'inherit' }]);
});

test('publish when yarn is true', async t => {
  const { execaStub } = t.context.stubs;
  const publisher = 'semantic-release-vsce';
  const name = 'Semantice Release VSCE';
  const publish = proxyquire('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: sinon.stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const token = 'abc123';
  process.env.VSCE_TOKEN = token;
  const yarn = true;
  const result = await publish(version, yarn, logger);

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
  const publish = proxyquire('../lib/publish', {
    execa: execaStub,
    'fs-extra': {
      readJson: sinon.stub().returns({
        publisher,
        name
      })
    }
  });

  const version = '1.0.0';
  const token = 'abc123';
  process.env.VSCE_TOKEN = token;
  process.env.VSCE_PAT = token;
  const result = await publish(version, undefined, logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
  t.deepEqual(execaStub.getCall(0).args, ['vsce', ['publish', version, '--no-git-tag-version'], { stdio: 'inherit' }]);
});
