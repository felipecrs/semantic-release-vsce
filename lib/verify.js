// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const verifyPkg = require('./verify-pkg');
const verifyVsceAuth = require('./verify-vsce-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');
const verifyTarget = require('./verify-target');
const { isOvsxPublishEnabled, isVscePublishEnabled } = require('./utils');

module.exports = async (pluginConfig, { logger, cwd }) => {
  await verifyPkg(cwd);
  await verifyTarget();

  if (pluginConfig?.publish !== false) {
    const vscePublishEnabled = isVscePublishEnabled();
    const ovsxPublishEnabled = isOvsxPublishEnabled();
    if (!vscePublishEnabled && !ovsxPublishEnabled) {
      throw new SemanticReleaseError(
        'No personal access token was detected. Set the `VSCE_PAT`, `VSCE_AZURE_CREDENTIALS`, or the `OVSX_PAT` environment variable, at least one of them must be present when publish is enabled.\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing',
        'ENOPAT',
      );
    }
    if (vscePublishEnabled) {
      await verifyVsceAuth(logger, cwd);
    } else {
      logger.log(
        'Skipping verification of the vsce personal access token as the `VSCE_PAT` or `VSCE_AZURE_CREDENTIALS` environment variables are not set.\n\nDid you know you can easily start publishing to Visual Studio Marketplace with `semantic-release-vsce`?\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing-to-visual-studio-marketplace',
      );
    }
    if (ovsxPublishEnabled) {
      await verifyOvsxAuth(logger, cwd);
    } else {
      logger.log(
        'Skipping verification of the ovsx personal access token as the `OVSX_PAT` environment variable is not set.\n\nDid you know you can easily start publishing to Open VSX Registry with `semantic-release-vsce`?\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing-to-open-vsx-registry',
      );
    }
  }
};
