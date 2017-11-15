const SemanticReleaseError = require('@semantic-release/error');

module.exports = async ({publishConfig, name}, logger) => {
  logger.log('Verify authentication for vsce');
  const {VSCE_PAT} = process.env;

  if (!VSCE_PAT) {
    throw new SemanticReleaseError('No vsce personal access token specified.', 'ENOVSCEPAT');
  }
};
