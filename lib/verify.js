const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');

module.exports = async logger => {
  await verifyPkg();

  await verifyAuth(logger);
};
