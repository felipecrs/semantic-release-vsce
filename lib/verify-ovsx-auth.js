// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for ovsx');

  if (!process.env.OVSX_PAT) {
    throw new SemanticReleaseError(
      'Empty ovsx personal access token (`OVSX_PAT` environment variable) specified.',
      'EEMPTYOVSXPAT',
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
