const SemanticReleaseError = require('@semantic-release/error');

module.exports = async ({publishConfig, name}, logger) => {
  logger.log('Verify authentication for vsce');
  const {VSCE_TOKEN} = process.env;

  if (!VSCE_TOKEN) {
    throw new SemanticReleaseError('No vsce personal access token specified. (set env "VSCE_TOKEN")', 'ENOVSCEPAT');
  }
};
