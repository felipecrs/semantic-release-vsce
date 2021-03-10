const execa = require('execa');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (logger) => {
  logger.log('Verify authentication for vsce');
  const { VSCE_TOKEN, VSCE_PAT } = process.env;

  if (!VSCE_TOKEN && !VSCE_PAT) {
    throw new SemanticReleaseError('No vsce personal access token specified (set the "VSCE_PAT" environment variable).', 'ENOVSCEPAT');
  }

  try {
    const options = ['verify-pat'];
    if (VSCE_TOKEN) {
      options.push('--pat', VSCE_TOKEN);
    }
    execa.sync('vsce', options);
  } catch (e) {
    throw new SemanticReleaseError(`Invalid vsce token. Additional information:\n\n${e}`, 'EINVALIDVSCETOKEN');
  }
};
