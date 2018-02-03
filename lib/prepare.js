const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, packageVsix, logger) => {
  await updatePackageVersion(version, logger);

  if (packageVsix) {
    logger.log('Packaging version %s as .vsix', version);
    await execa('vsce', ['package', '--out', packageVsix], { stdio: 'inherit' });
  }
};
