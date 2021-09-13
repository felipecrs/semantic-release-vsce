const execa = require('execa');
const { readJson } = require('fs-extra');
const { isOvsxEnabled } = require('./verify-ovsx-auth');

module.exports = async (version, packageVsix, yarn, logger) => {
  const ovsxEnabled = isOvsxEnabled();
  if (packageVsix || ovsxEnabled) {
    if (!packageVsix && ovsxEnabled) {
      logger.log('Packaging to VSIX even though `packageVsix` is not set as publish to OpenVSX is enabled.');
    }

    let packagePath;

    if (typeof packageVsix === 'string') {
      packagePath = packageVsix;
    } else {
      const { name } = await readJson('./package.json');
      packagePath = `${name}-${version}.vsix`;
    }

    logger.log(`Packaging version ${version} to ${packagePath}`);

    const options = ['package', version, '--no-git-tag-version', '--out', packagePath];

    if (yarn) {
      options.push('--yarn');
    }

    await execa('vsce', options, { stdio: 'inherit' });

    return packagePath;
  }
};
