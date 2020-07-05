const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const logger = {
  log: sinon.fake()
};

test.beforeEach(t => {
  t.context.stubs = {
    writeJsonStub: sinon.stub()
  };
});

test.afterEach(t => {
  t.context.stubs.writeJsonStub.resetHistory();
});

test('package.json indentation uses spaces', async t => {
  const { writeJsonStub } = t.context.stubs;
  const updatePackageVersion = proxyquire('../lib/update-package-version', {
    'fs-extra': {
      // test with 3 spaces so we don't hit the default
      readFile: sinon.stub().returns('{\n   "name":"test"\n}'),
      writeJson: writeJsonStub,
      pathExists: sinon.stub().returns(false)
    }
  });

  await updatePackageVersion('1.0.0', logger);
  t.deepEqual(writeJsonStub.getCall(0).args,
    ['./package.json', { name: 'test', version: '1.0.0' }, { spaces: '   ' }]
  );
});

test('package.json indentation uses tabs', async t => {
  const { writeJsonStub } = t.context.stubs;
  const updatePackageVersion = proxyquire('../lib/update-package-version', {
    'fs-extra': {
      readFile: sinon.stub().returns('{\n\t"name":"test"\n}'),
      writeJson: writeJsonStub,
      pathExists: sinon.stub().returns(false)
    }
  });

  await updatePackageVersion('1.0.0', logger);
  t.deepEqual(writeJsonStub.getCall(0).args,
    ['./package.json', { name: 'test', version: '1.0.0' }, { spaces: '\t' }]
  );
});

test('package.json indentation is undetermined', async t => {
  const { writeJsonStub } = t.context.stubs;
  const updatePackageVersion = proxyquire('../lib/update-package-version', {
    'fs-extra': {
      readFile: sinon.stub().returns('{"name":"test"}'),
      writeJson: writeJsonStub,
      pathExists: sinon.stub().returns(false)
    }
  });

  await updatePackageVersion('1.0.0', logger);
  t.deepEqual(writeJsonStub.getCall(0).args,
    ['./package.json', { name: 'test', version: '1.0.0' }, { spaces: '  ' }]
  );
});

test('npm-shrinkwrap.json indentation uses spaces', async t => {
  const { writeJsonStub } = t.context.stubs;
  const updatePackageVersion = proxyquire('../lib/update-package-version', {
    'fs-extra': {
      // test with 3 spaces so we don't hit the default
      readFile: sinon.stub().returns('{\n   "version":"0.0.0"\n}'),
      writeJson: writeJsonStub,
      pathExists: sinon.stub().returns(true)
    }
  });

  await updatePackageVersion('1.0.0', logger);
  t.deepEqual(writeJsonStub.getCall(1).args,
    ['./npm-shrinkwrap.json', { version: '1.0.0' }, { spaces: '   ' }]
  );
});

test('npm-shrinkwrap.json indentation uses tabs', async t => {
  const { writeJsonStub } = t.context.stubs;
  const updatePackageVersion = proxyquire('../lib/update-package-version', {
    'fs-extra': {
      readFile: sinon.stub().returns('{\n\t"version":"0.0.0"\n}'),
      writeJson: writeJsonStub,
      pathExists: sinon.stub().returns(true)
    }
  });

  await updatePackageVersion('1.0.0', logger);
  t.deepEqual(writeJsonStub.getCall(1).args,
    ['./npm-shrinkwrap.json', { version: '1.0.0' }, { spaces: '\t' }]
  );
});

test('npm-shrinkwrap.json indentation is undetermined', async t => {
  const { writeJsonStub } = t.context.stubs;
  const updatePackageVersion = proxyquire('../lib/update-package-version', {
    'fs-extra': {
      readFile: sinon.stub().returns('{"version":"0.0.0"}'),
      writeJson: writeJsonStub,
      pathExists: sinon.stub().returns(true)
    }
  });

  await updatePackageVersion('1.0.0', logger);
  t.deepEqual(writeJsonStub.getCall(1).args,
    ['./npm-shrinkwrap.json', { version: '1.0.0' }, { spaces: '  ' }]
  );
});
