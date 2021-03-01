const execa = require('execa');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (logger) => {
  logger.log('Verify authentication for vsce');
  const { VSCE_TOKEN } = process.env;

  if (!VSCE_TOKEN) {
    throw new SemanticReleaseError('No vsce personal access token specified (set the "VSCE_TOKEN" environment variable).', 'ENOVSCEPAT');
  }

  try {
    execa.sync('vsce', ['verify-pat', '--pat', VSCE_TOKEN]);
  } catch (e) {
    throw new SemanticReleaseError(`Invalid vsce token. Additional information:\n\n${e}`, 'EINVALIDVSCETOKEN');
  }
};
