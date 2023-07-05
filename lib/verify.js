// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');
const verifyTarget = require('./verify-target');
const { isOvsxEnabled } = require('./utils');

module.exports = async (pluginConfig, { logger, cwd }) => {
  await verifyPkg();
  await verifyTarget();

  if (pluginConfig?.publish !== false) {
    try {
      await verifyAuth(logger, cwd);
    } catch (err) {
      if (
        err instanceof SemanticReleaseError &&
        err.code === 'ENOVSCEPAT' &&
        isOvsxEnabled()
      ) {
        logger.log(
          'The vsce personal access token is missing (set the `VSCE_PAT` environment variable) but publish to OpenVSX is enabled.',
        );
      } else {
        throw err;
      }
    }
    await verifyOvsxAuth(logger, cwd);
  }
};
