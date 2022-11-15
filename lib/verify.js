// @ts-check

const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (pluginConfig, { logger, cwd }) => {
  await verifyPkg();

  if (process.env.VSCE_TARGET) {
    const targets = require('vsce/out/package').Targets;

    // Throw if the target is not supported
    if (!targets.has(process.env.VSCE_TARGET)) {
      throw new SemanticReleaseError(
        `Unsupported VSCE_TARGET: ${
          process.env.VSCE_TARGET
        }. Available targets: ${Object.values(targets).join(', ')}`,
        'EINVALIDVSCETARGET'
      );
    }
  }

  if (pluginConfig?.publish !== false) {
    await verifyAuth(logger, cwd);
    await verifyOvsxAuth(logger);
  }
};
