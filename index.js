// @ts-check

const verifyVsce = require('./lib/verify');
const vscePublish = require('./lib/publish');
const vscePrepare = require('./lib/prepare');

let verified = false;
let prepared = false;
let packagePath;

async function verifyConditions(pluginConfig, { logger, cwd }) {
  await verifyVsce(pluginConfig, { logger, cwd });
  verified = true;
}

async function prepare(
  pluginConfig,
  { nextRelease: { version }, logger, cwd }
) {
  if (!verified) {
    await verifyVsce(pluginConfig, { logger, cwd });
    verified = true;
  }
  packagePath = await vscePrepare(
    version,
    pluginConfig.packageVsix,
    logger,
    cwd
  );
  prepared = true;
}

async function publish(
  pluginConfig,
  { nextRelease: { version }, logger, cwd }
) {
  if (!verified) {
    await verifyVsce(pluginConfig, { logger, cwd });
    verified = true;
  }

  if (!prepared) {
    // BC: prior to semantic-release v15 prepare was part of publish
    packagePath = await vscePrepare(
      version,
      pluginConfig.packageVsix,
      logger,
      cwd
    );
  }

  // If publishing is disabled, return early.
  if (pluginConfig?.publish === false) {
    return;
  }

  if (pluginConfig?.publishPackagePath) {
    // Expand glob
    const glob = require('glob');
    packagePath = glob.sync(pluginConfig.publishPackagePath, { cwd });
  }

  return vscePublish(version, packagePath, logger, cwd);
}

module.exports = {
  verifyConditions,
  prepare,
  publish,
};
