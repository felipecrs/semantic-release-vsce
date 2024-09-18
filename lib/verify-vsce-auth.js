// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  const patAuth = 'VSCE_PAT' in process.env && process.env.VSCE_PAT;
  const vsceAuth =
    'VSCE_AZURE_CREDENTIAL' in process.env && process.env.VSCE_AZURE_CREDENTIAL;

  if (!patAuth && !vsceAuth) {
    throw new SemanticReleaseError(
      'Neither vsce personal access token (`VSCE_PAT` environment variable) or Azure Credentials flag (`VSCE_AZURE_CREDENTIAL` environment variable) specified.',
      'EVSCEAUTHNOTPROVIDED',
    );
  }

  if (patAuth && vsceAuth) {
    throw new SemanticReleaseError(
      'Both vsce personal access token (`VSCE_PAT` environment variable) or Azure Credentials flag (`VSCE_AZURE_CREDENTIAL` environment variable) specified.  Please use only one.',
      'EVSCEDUPLICATEAUTHPROVIDED',
    );
  }

  const vsceArgs = ['verify-pat'];
  if (vsceAuth) {
    vsceArgs.push('--azure-credential');
  }

  try {
    await execa('vsce', vsceArgs, { preferLocal: true, cwd });
  } catch (e) {
    throw new SemanticReleaseError(
      `Invalid vsce personal access token. Additional information:\n\n${e}`,
      'EINVALIDVSCEPAT',
    );
  }
};
