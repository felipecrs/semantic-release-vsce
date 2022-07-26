const verifyVsce = require('./lib/verify');
const vscePublish = require('./lib/publish');
const vscePrepare = require('./lib/prepare');

let verified = false;
let prepared = false;
let packagePath;

async function verifyConditions (pluginConfig, { logger }) {
  await verifyVsce(logger, pluginConfig);
  verified = true;
}

async function prepare (pluginConfig, { nextRelease: { version }, logger }) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }
  packagePath = await vscePrepare(version, pluginConfig.packageVsix, logger);
  prepared = true;
}

async function publish (pluginConfig, { nextRelease: { version }, logger }) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }

  if (!prepared) {
    // BC: prior to semantic-release v15 prepare was part of publish
    packagePath = await vscePrepare(version, pluginConfig.packageVsix, logger);
  }

  // If publishing is disabled, return early.
  if (pluginConfig?.publish === false) {
    return;
  }

  return vscePublish(version, packagePath, logger);
}

module.exports = {
  verifyConditions,
  prepare,
  publish
};
