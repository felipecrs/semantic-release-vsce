// @ts-check

import path from 'node:path';
import { prepare as vscePrepare } from './lib/prepare.js';
import { publish as vscePublish } from './lib/publish.js';
import { verify as vsceVerify } from './lib/verify.js';

let verified = false;
let prepared = false;
let packagePath;

export async function verifyConditions(pluginConfig, { logger, cwd }) {
  cwd = getPackageRoot(pluginConfig, cwd);
  await vsceVerify(pluginConfig, { logger, cwd });
  verified = true;
}

export async function prepare(
  pluginConfig,
  { nextRelease: { version }, logger, cwd },
) {
  cwd = getPackageRoot(pluginConfig, cwd);
  if (!verified) {
    await vsceVerify(pluginConfig, { logger, cwd });
    verified = true;
  }
  packagePath = await vscePrepare(
    version,
    pluginConfig.packageVsix,
    logger,
    cwd,
  );
  prepared = true;
}

export async function publish(
  pluginConfig,
  { nextRelease: { version }, logger, cwd },
) {
  cwd = getPackageRoot(pluginConfig, cwd);
  if (!verified) {
    await vsceVerify(pluginConfig, { logger, cwd });
    verified = true;
  }

  if (!prepared) {
    // BC: prior to semantic-release v15 prepare was part of publish
    packagePath = await vscePrepare(
      version,
      pluginConfig.packageVsix,
      logger,
      cwd,
    );
  }

  // If publishing is disabled, return early.
  if (pluginConfig?.publish === false) {
    return;
  }

  if (pluginConfig?.publishPackagePath) {
    // Expand glob
    const { glob } = await import('glob');
    packagePath = await glob(pluginConfig.publishPackagePath, { cwd });
  }

  return vscePublish(version, packagePath, logger, cwd);
}

function getPackageRoot(pluginConfig, cwd) {
  return pluginConfig.packageRoot
    ? path.join(cwd, pluginConfig.packageRoot)
    : cwd;
}
