// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const verifyPkg = require('./verify-pkg');
const verifyVsceAuth = require('./verify-vsce-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');
const verifyTarget = require('./verify-target');
const { isOvsxPublishEnabled, isVscePublishEnabled } = require('./utils');

module.exports = async (pluginConfig, { logger, cwd }) => {
  await verifyPkg();
  await verifyTarget();

  if (pluginConfig?.publish !== false) {
    const vscePublishEnabled = isVscePublishEnabled();
    const ovsxPublishEnabled = isOvsxPublishEnabled();
    if (!vscePublishEnabled && !ovsxPublishEnabled) {
      throw new SemanticReleaseError(
        'Could not detect the vsce or the ovsx personal access token. Set the `VSCE_PAT` or the `OVSX_PAT` environment variable. At least one of them must present to publish the VSIX.\nLearn more at https://github.com/felipecrs/semantic-release-vsce#environment-variables',
        'ENOPAT',
      );
    }
    if (vscePublishEnabled) {
      await verifyVsceAuth(logger, cwd);
    } else {
      logger.log(
        'Skipping verification of vsce personal token because the `VSCE_PAT` environment variable is not set.\n\nDid you know you can easily start publishing to Visual Studio Marketplace with `semantic-release-vsce`?\nLearn more at https://github.com/felipecrs/semantic-release-vsce#environment-variables',
      );
    }
    if (ovsxPublishEnabled) {
      await verifyOvsxAuth(logger, cwd);
    } else {
      logger.log(
        'Skipping verification of ovsx personal token because the `OVSX_PAT` environment variable is not set.\n\nDid you know you can easily start publishing to OpenVSX with `semantic-release-vsce`?\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing-to-openvsx',
      );
    }
  }
};
