const verifyVsce = require('./lib/verify');
const vscePublish = require('./lib/publish');
const vscePrepare = require('./lib/prepare');

let verified = false;
let prepared = false;
let packagePath;

async function verifyConditions (pluginConfig, context) {
  await verifyVsce(context, pluginConfig);
  verified = true;
}

async function prepare (pluginConfig, context) {
  if (!verified) {
    await verifyVsce(context);
    verified = true;
  }
  packagePath = await vscePrepare(context, pluginConfig);
  prepared = true;
}

async function publish (pluginConfig, context) {
  if (!verified) {
    await verifyVsce(context);
    verified = true;
  }

  if (!prepared) {
    // BC: prior to semantic-release v15 prepare was part of publish
    packagePath = await vscePrepare(context, pluginConfig);
  }

  // If publishing is disabled, return early.
  if (pluginConfig?.publish === false) {
    return;
  }

  return vscePublish(context, packagePath);
}

module.exports = {
  verifyConditions,
  prepare,
  publish
};
