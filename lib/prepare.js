// @ts-check

import { readJson } from 'fs-extra/esm';
import path from 'node:path';
import process from 'node:process';
import { isOvsxPublishEnabled, isTargetEnabled } from './utilities.js';
import { createVSIX } from '@vscode/vsce';

export async function prepare(version, packageVsix, logger, cwd) {
  if (packageVsix === false) {
    return;
  }

  const ovsxPublishEnabled = isOvsxPublishEnabled();

  if (packageVsix || ovsxPublishEnabled) {
    if (!packageVsix && ovsxPublishEnabled) {
      logger.log(
        'Packaging to VSIX even though `packageVsix` is not set as publish to OpenVSX is enabled.',
      );
    }

    let packagePath;

    if (typeof packageVsix === 'string') {
      packagePath = packageVsix;
    } else {
      const { name } = await readJson(path.join(cwd, './package.json'));
      packagePath = isTargetEnabled()
        ? `${name}-${process.env.VSCE_TARGET}-${version}.vsix`
        : `${name}-${version}.vsix`;
    }

    logger.log(`Packaging version ${version} to ${packagePath}`);

    /** @type {{ -readonly [K in keyof import('@vscode/vsce').IPackageOptions]: import('@vscode/vsce').IPackageOptions[K] }} */
    const options = {
      cwd,
      version,
      packagePath,
    };

    if (isTargetEnabled()) {
      options.target = process.env.VSCE_TARGET;
    }

    await createVSIX(options);

    return packagePath;
  }
}
