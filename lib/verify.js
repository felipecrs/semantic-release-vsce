const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');

module.exports = async (context, pluginConfig) => {
  await verifyPkg();

  if (pluginConfig?.publish !== false) {
    await verifyAuth(context);
    await verifyOvsxAuth(context);
  }
};
