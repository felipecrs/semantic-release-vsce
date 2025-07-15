import avaTest from 'ava';
import { fake, stub } from 'sinon';
import esmock from 'esmock';
import SemanticReleaseError from '@semantic-release/error';
import path from 'node:path';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

const logger = {
  log: fake(),
};
// eslint-disable-next-line unicorn/prevent-abbreviations
const localDir = path.resolve(import.meta.dirname, '../lib');
const cwd = process.cwd();

test('VSCE_PAT is set', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat'], { preferLocal: true, localDir, cwd })
        .resolves(),
    },
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('VSCE_AZURE_CREDENTIAL is set to true', async (t) => {
  stub(process, 'env').value({
    VSCE_AZURE_CREDENTIAL: 'true',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat', '--azure-credential'], {
          preferLocal: true,
          cwd,
        })
        .resolves(),
    },
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('VSCE_AZURE_CREDENTIAL is set to 1', async (t) => {
  stub(process, 'env').value({
    VSCE_AZURE_CREDENTIAL: '1',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat', '--azure-credential'], {
          preferLocal: true,
          cwd,
        })
        .resolves(),
    },
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('VSCE_AZURE_CREDENTIAL is set to false', async (t) => {
  stub(process, 'env').value({
    VSCE_AZURE_CREDENTIAL: 'false',
  });

  const { verifyVsceAuth } = await import('../lib/verify-vsce-auth.js');

  await t.throwsAsync(() => verifyVsceAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EVSCEAUTHNOTPROVIDED',
  });
});

test('VSCE_PAT is valid', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat'], { preferLocal: true, localDir, cwd })
        .resolves(),
    },
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('VSCE_PAT is valid and VSCE_AZURE_CREDENTIAL=false', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123',
    VSCE_AZURE_CREDENTIAL: 'false',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat'], { preferLocal: true, localDir, cwd })
        .resolves(),
    },
  });

  await t.notThrowsAsync(() => verifyVsceAuth(logger));
});

test('Neither VSCE_PAT or VSCE_AZURE_CREDENTIAL are set', async (t) => {
  const logger = {
    log: fake(),
  };

  stub(process, 'env').value({
    VSCE_PAT: '',
  });

  const { verifyVsceAuth } = await import('../lib/verify-vsce-auth.js');

  await t.throwsAsync(() => verifyVsceAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EVSCEAUTHNOTPROVIDED',
  });
});

test('VSCE_PAT is invalid but not empty', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat'], { preferLocal: true, localDir, cwd })
        .rejects(),
    },
  });

  await t.throwsAsync(() => verifyVsceAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EINVALIDVSCEPAT',
  });
});

test('Both VSCE_PAT and VSCE_AZURE_CREDENTIAL are set', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123',
    VSCE_AZURE_CREDENTIAL: 'true',
  });

  const { verifyVsceAuth } = await esmock('../lib/verify-vsce-auth.js', {
    execa: {
      execa: stub()
        .withArgs('vsce', ['verify-pat'], { preferLocal: true, localDir, cwd })
        .rejects(),
    },
  });

  await t.throwsAsync(() => verifyVsceAuth(logger), {
    instanceOf: SemanticReleaseError,
    code: 'EVSCEDUPLICATEAUTHPROVIDED',
  });
});
