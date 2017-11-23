const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, packageVsix, logger) => {
  const { VSCE_TOKEN } = process.env;

  await updatePackageVersion(version, logger);

  logger.log('Publishing version %s to vs code marketplace', version);
  await execa('vsce', ['publish', '-t', VSCE_TOKEN], {stdio: 'inherit'});

  if (packageVsix) {
    logger.log('Packaging version %s as .vsix', version);
    await execa('vsce', ['package', '--out', packageVsix], { stdio: 'inherit' });
  }
};
