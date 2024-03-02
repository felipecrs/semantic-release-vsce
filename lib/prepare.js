// @ts-check

const execa = require('execa');
const { readJson } = require('fs-extra');
const path = require('path');
const { isOvsxPublishEnabled, isTargetEnabled } = require('./utils');

module.exports = async (version, packageVsix, logger, cwd) => {
  if (packageVsix === false) {
    return;
  }

  const ovsxPublishEnabled = isOvsxPublishEnabled();

  if (packageVsix || ovsxPublishEnabled) {
    if (!packageVsix && ovsxPublishEnabled) {
      logger.log(
        'Packaging to VSIX even though `packageVsix` is not set as publish to OpenVSX is enabled.',
      );
    }

    let packagePath;

    if (typeof packageVsix === 'string') {
      packagePath = packageVsix;
    } else {
      const { name } = await readJson(path.join(cwd, './package.json'));
      if (isTargetEnabled()) {
        packagePath = `${name}-${process.env.VSCE_TARGET}-${version}.vsix`;
      } else {
        packagePath = `${name}-${version}.vsix`;
      }
    }

    logger.log(`Packaging version ${version} to ${packagePath}`);

    const options = [
      'package',
      version,
      '--no-git-tag-version',
      '--out',
      packagePath,
    ];
    if (isTargetEnabled()) {
      options.push('--target', process.env.VSCE_TARGET);
    }

    await execa('vsce', options, { stdio: 'inherit', preferLocal: true, cwd });

    return packagePath;
  }
};
