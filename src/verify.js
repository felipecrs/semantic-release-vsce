const verifyPkg = require('./verify-pkg');
const setAuth = require('./set-auth');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (pkg, logger) => {
  verifyPkg(pkg);
  await setAuth(pkg, logger);
  try {
    // TODO: Verify output
  } catch (err) {
    throw new SemanticReleaseError('Invalid vsce token.', 'EINVALIDVSCETOKEN');
  }
};
