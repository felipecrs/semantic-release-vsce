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

  const result = await publish('1.0.0', logger);

  t.deepEqual(result, {
    name: 'Visual Studio Marketplace',
    url: `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`
  });
});
