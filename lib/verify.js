const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');
const verifyOvsxAuth = require('./verify-ovsx-auth');

module.exports = async logger => {
  await verifyPkg();

  await verifyAuth(logger);

  await verifyOvsxAuth(logger);
};
