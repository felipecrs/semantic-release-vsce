const verifyPkg = require('./verify-pkg');
const verifyAuth = require('./verify-auth');
const getPkg = require('read-pkg-up');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async logger => {
  const { packageJson } = await getPkg();
  if (!packageJson) {
    throw new SemanticReleaseError(
      'package.json not found. A package.json is required to release with vsce.',
      'ENOPKG'
    );
  }
  verifyPkg(packageJson);

  verifyAuth(logger);
};
