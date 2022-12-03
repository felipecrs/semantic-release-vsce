// @ts-check

const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');
const verifyTarget = require('./verify-target');

module.exports = async (pluginConfig, { logger, cwd }) => {
  await verifyPkg();
  await verifyTarget();

  if (pluginConfig?.publish !== false) {
    await verifyAuth(logger, cwd);
    await verifyOvsxAuth(logger, cwd);
  }
};
