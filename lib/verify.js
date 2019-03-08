const verifyPkg = require('./verify-pkg');
const setAuth = require('./set-auth');
const getPkg = require('read-pkg-up');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (pluginConfig, logger) => {
  const { pkgRoot } = pluginConfig;
  const { pkg } = await getPkg({ cwd: pkgRoot });
  if (!pkg) {
    throw new SemanticReleaseError('package.json not found. A package.json is required to release with vsce.', 'ENOPKG');
  }

  verifyPkg(pkg);
  await setAuth(logger);
  try {
    // TODO: Verify output
  } catch (err) {
    throw new SemanticReleaseError('Invalid vsce token.', 'EINVALIDVSCETOKEN');
  }
};
