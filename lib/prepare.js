const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, pluginConfig, logger) => {
  await updatePackageVersion(version, pluginConfig, logger);

  const { packageVsix, pkgRoot } = pluginConfig;
  if (packageVsix) {
    logger.log('Packaging version %s as .vsix', version);
    await execa('vsce', ['package', '--out', packageVsix], { stdio: 'inherit', cwd: pkgRoot });
  }
};
