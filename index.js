const verifyVsce = require('./lib/verify');
const vscePublish = require('./lib/publish');
const vscePrepare = require('./lib/prepare');

let verified = false;
let prepared = false;

async function verifyConditions (pluginConfig, {logger}) {
  await verifyVsce(logger);
  verified = true;
}

async function prepare (pluginConfig, {nextRelease: {version}}, logger) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }
  await vscePrepare(version, pluginConfig.packageVsix, logger);
  prepared = true;
}

async function publish (pluginConfig, {nextRelease: {version}, logger}) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }

  if (!prepared) {
    // BC: prior to semantic-release v15 prepare was part of publish
    await vscePrepare(version, pluginConfig);
  }
  await vscePublish(version, logger);
}

module.exports = {
  verifyConditions,
  prepare,
  publish
};
