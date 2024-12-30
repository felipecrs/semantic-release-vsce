// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import { isOvsxPublishEnabled, isVscePublishEnabled } from './utils.js';
import { verifyOvsxAuth } from './verify-ovsx-auth.js';
import { verifyPackage } from './verify-package.js';
import { verifyTarget } from './verify-target.js';
import { verifyVsceAuth } from './verify-vsce-auth.js';

export async function verify(pluginConfig, { logger, cwd }) {
  await verifyPackage(cwd);
  await verifyTarget();

  if (pluginConfig?.publish !== false) {
    const vscePublishEnabled = isVscePublishEnabled();
    const ovsxPublishEnabled = isOvsxPublishEnabled();
    if (!vscePublishEnabled && !ovsxPublishEnabled) {
      throw new SemanticReleaseError(
        'No personal access token was detected. Set `VSCE_PAT`, `VSCE_AZURE_CREDENTIAL`, or the `OVSX_PAT` environment variable. At least one of them must be present when publish is enabled.\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing',
        'ENOPAT',
      );
    }
    if (vscePublishEnabled) {
      await verifyVsceAuth(logger, cwd);
    } else {
      logger.log(
        'Skipping verification of the vsce personal access token as the `VSCE_PAT` or `VSCE_AZURE_CREDENTIAL` environment variables are not set.\n\nDid you know you can easily start publishing to Visual Studio Marketplace with `semantic-release-vsce`?\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing-to-visual-studio-marketplace',
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
}
