// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  if (!process.env.VSCE_PAT && !process.env.VSCE_AZURE_CREDENTIALS) {
    throw new SemanticReleaseError(
      'Neither vsce personal access token (`VSCE_PAT` environment variable) or Azure Credentials flag (`VSCE_AZURE_CREDENTIALS` environment variable) specified.',
      'EVSCEAUTHNOTPROVIDED',
    );
  }

  if (process.env.VSCE_PAT && process.env.VSCE_AZURE_CREDENTIALS) {
    throw new SemanticReleaseError(
      'Both vsce personal access token (`VSCE_PAT` environment variable) or Azure Credentials flag (`VSCE_AZURE_CREDENTIALS` environment variable) specified.  Please use only one.',
      'EVSCEDUPLICATEAUTHPROVIDED',
    );
  }

  const vsceFlags = ['verify-pat'];
  if (process.env.VSCE_AZURE_CREDENTIALS) {
    vsceFlags.push('--azure-credential');
  }

  try {
    await execa('vsce', vsceFlags, { preferLocal: true, cwd });
  } catch (e) {
    throw new SemanticReleaseError(
      `Invalid vsce personal access token. Additional information:\n\n${e}`,
      'EINVALIDVSCEPAT',
    );
  }
};
