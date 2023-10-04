// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for vsce');

  if (!process.env.VSCE_PAT) {
    throw new SemanticReleaseError(
      'Empty vsce personal access token (`VSCE_PAT` environment variable) specified.',
      'EEMPTYVSCEPAT',
    );
  }

  try {
    await execa('vsce', ['verify-pat'], { preferLocal: true, cwd });
  } catch (e) {
    throw new SemanticReleaseError(
      `Invalid vsce personal access token. Additional information:\n\n${e}`,
      'EINVALIDVSCEPAT',
    );
  }
};
