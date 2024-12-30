import SemanticReleaseError from '@semantic-release/error';
import test from 'ava';
import { fake, stub } from 'sinon';
import esmock from 'esmock';

const logger = {
  log: fake(),
};
const cwd = process.cwd();

test('resolves', async (t) => {
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stub().resolves(),
    },
    '../lib/verify-target.js': {
      verifyTarget: stub().resolves(),
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stub().resolves(),
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stub().resolves(),
    },
    '../lib/utils.js': {
      isVscePublishEnabled: stub().returns(true),
      isOvsxPublishEnabled: stub().returns(true),
    },
  });

  await t.notThrowsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-pkg', async (t) => {
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stub().rejects(),
    },
    '../lib/verify-target.js': {
      verifyTarget: stub().resolves(),
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stub().resolves(),
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stub().resolves(),
    },
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-target', async (t) => {
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stub().resolves(),
    },
    '../lib/verify-target.js': {
      verifyTarget: stub().rejects(),
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stub().resolves(),
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stub().resolves(),
    },
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-auth', async (t) => {
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stub().resolves(),
    },
    '../lib/verify-target.js': {
      verifyTarget: stub().resolves(),
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stub().rejects(),
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stub().resolves(),
    },
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('rejects with verify-ovsx-auth', async (t) => {
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stub().resolves(),
    },
    '../lib/verify-target.js': {
      verifyTarget: stub().resolves(),
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stub().resolves(),
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stub().rejects(),
    },
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }));
});

test('it does not verify the auth tokens if publishing is disabled', async (t) => {
  const stubs = {
    verifyPkgStub: stub().resolves(),
    verifyTargetStub: stub().resolves(),
    verifyVsceAuthStub: stub().resolves(),
    verifyOvsxAuthStub: stub().resolves(),
  };
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stubs.verifyPkgStub,
    },
    '../lib/verify-target.js': {
      verifyTarget: stubs.verifyTargetStub,
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stubs.verifyVsceAuthStub,
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stubs.verifyOvsxAuthStub,
    },
  });

  await verify({ publish: false }, { logger, cwd });

  t.true(stubs.verifyVsceAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
});

test('errors when neither vsce nor ovsx personal access token is configured', async (t) => {
  const stubs = {
    verifyPkgStub: stub().resolves(),
    verifyTargetStub: stub().resolves(),
    verifyVsceAuthStub: stub().resolves(),
    verifyOvsxAuthStub: stub().resolves(),
    utilsStub: {
      isVscePublishEnabled: stub().returns(false),
      isOvsxPublishEnabled: stub().returns(false),
    },
  };
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stubs.verifyPkgStub,
    },
    '../lib/verify-target.js': {
      verifyTarget: stubs.verifyTargetStub,
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stubs.verifyVsceAuthStub,
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stubs.verifyOvsxAuthStub,
    },
    '../lib/utils.js': stubs.utilsStub,
  });

  await t.throwsAsync(() => verify({}, { logger, cwd }), {
    instanceOf: SemanticReleaseError,
    code: 'ENOPAT',
  });
  t.true(stubs.verifyVsceAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
});

test('verify vsce only', async (t) => {
  const stubs = {
    verifyPkgStub: stub().resolves(),
    verifyTargetStub: stub().resolves(),
    verifyVsceAuthStub: stub().resolves(),
    verifyOvsxAuthStub: stub().resolves(),
    utilsStub: {
      isVscePublishEnabled: stub().returns(true),
      isOvsxPublishEnabled: stub().returns(false),
    },
    logger: {
      log: fake(),
    },
  };
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stubs.verifyPkgStub,
    },
    '../lib/verify-target.js': {
      verifyTarget: stubs.verifyTargetStub,
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stubs.verifyVsceAuthStub,
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stubs.verifyOvsxAuthStub,
    },
    '../lib/utils.js': stubs.utilsStub,
  });

  await verify({}, { logger: stubs.logger, cwd });
  t.true(stubs.verifyVsceAuthStub.calledOnce);
  t.true(stubs.verifyOvsxAuthStub.notCalled);
  t.true(stubs.logger.log.calledOnce);
});

test('verify ovsx only', async (t) => {
  const stubs = {
    verifyPkgStub: stub().resolves(),
    verifyTargetStub: stub().resolves(),
    verifyVsceAuthStub: stub().resolves(),
    verifyOvsxAuthStub: stub().resolves(),
    utilsStub: {
      isVscePublishEnabled: stub().returns(false),
      isOvsxPublishEnabled: stub().returns(true),
    },
    logger: {
      log: fake(),
    },
  };
  const { verify } = await esmock('../lib/verify.js', {
    '../lib/verify-package.js': {
      verifyPackage: stubs.verifyPkgStub,
    },
    '../lib/verify-target.js': {
      verifyTarget: stubs.verifyTargetStub,
    },
    '../lib/verify-vsce-auth.js': {
      verifyVsceAuth: stubs.verifyVsceAuthStub,
    },
    '../lib/verify-ovsx-auth.js': {
      verifyOvsxAuth: stubs.verifyOvsxAuthStub,
    },
    '../lib/utils.js': stubs.utilsStub,
  });

  await verify({}, { logger: stubs.logger, cwd });
  t.true(stubs.verifyVsceAuthStub.notCalled);
  t.true(stubs.verifyOvsxAuthStub.calledOnce);
  t.true(stubs.logger.log.calledOnce);
});
