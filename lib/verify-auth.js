const execa = require('execa');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (logger) => {
  logger.log('Verifying authentication for vsce');

  if (!process.env.VSCE_PAT) {
    throw new SemanticReleaseError('No vsce personal access token specified (set the `VSCE_PAT` environment variable).', 'ENOVSCEPAT');
  }

  try {
    await execa('vsce', ['verify-pat'], { preferLocal: true });
  } catch (e) {
    throw new SemanticReleaseError(`Invalid vsce token. Additional information:\n\n${e}`, 'EINVALIDVSCETOKEN');
  }
};
