// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for vsce');

  if (!process.env.VSCE_PAT) {
    if (typeof process.env.VSCE_PAT === 'string') {
      throw new SemanticReleaseError(
        'Empty vsce personal access token specified (set the `VSCE_PAT` environment variable).',
        'EINVALIDVSCEPAT',
      );
    }
    throw new SemanticReleaseError(
      'No vsce personal access token specified (set the `VSCE_PAT` environment variable).',
      'ENOVSCEPAT',
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
