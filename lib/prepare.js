const execa = require('execa');

module.exports = async (version, packageVsix, yarn, logger) => {
  if (packageVsix) {
    logger.log(`Packaging version ${version} as VSIX`);

    const options = ['package', version, '--no-git-tag-version'];

    if (typeof packageVsix === 'string') {
      options.push(...['--out', packageVsix]);
    }

    if (yarn) {
      options.push('--yarn');
    }

    await execa('vsce', options, { stdio: 'inherit' });
  }
};
