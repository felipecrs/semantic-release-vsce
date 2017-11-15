const verifyPkg = require('./verify-pkg');
const setAuth = require('./set-auth');
const execa = require('execa');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (pkg, logger) => {
  verifyPkg(pkg);
  await setAuth(pkg, logger);
  try {
    await execa('vsce', ['ls-publishers']);
    // TODO: Verify output
  } catch (err) {
    throw new SemanticReleaseError('Invalid meteor token.', 'EINVALIDMETEORTOKEN');
  }
};
