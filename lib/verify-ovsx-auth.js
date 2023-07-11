// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for ovsx');

  if (!process.env.OVSX_PAT) {
    if (typeof process.env.OVSX_PAT === 'string') {
      throw new SemanticReleaseError(
        'Empty ovsx personal access token specified (set the `OVSX_PAT` environment variable).',
        'EINVALIDOVSXPAT',
      );
    }
    throw new SemanticReleaseError(
      'No ovsx personal access token specified (set the `OVSX_PAT` environment variable).',
      'ENOOVSXPAT',
    );
  }

  try {
    await execa('ovsx', ['verify-pat'], { preferLocal: true, cwd });
  } catch (e) {
    throw new SemanticReleaseError(
      `Invalid ovsx personal access token. Additional information:\n\n${e}`,
      'EINVALIDOVSXPAT',
    );
  }
};
