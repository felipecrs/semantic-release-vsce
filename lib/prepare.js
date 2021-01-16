const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, packageVsix, yarn, logger) => {
  await updatePackageVersion(version, logger);

  if (packageVsix) {
    logger.log('Packaging version %s as .vsix', version);

    const options = ['package'];

    if (typeof packageVsix === 'string') {
      options.concat(['--out', packageVsix]);
    }

    if (yarn) {
      options.push('--yarn');
    }

    await execa('vsce', options, { stdio: 'inherit' });
  }
};
