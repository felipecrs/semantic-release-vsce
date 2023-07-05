// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');
const { readJson } = require('fs-extra');
const { isOvsxEnabled, isTargetEnabled, isVsceEnabled } = require('./utils');

module.exports = async (version, packagePath, logger, cwd) => {
  const vsceEnabled = isVsceEnabled();
  const ovsxEnabled = isOvsxEnabled();
  if (!vsceEnabled && !ovsxEnabled) {
    throw new SemanticReleaseError(
      'Could not detect the `VSCE_PAT` or `OVSX_PAT` environment variable. At least one of them must present to publish the VSIX.',
      'ENOPAT',
    );
  }

  const { publisher, name } = await readJson('./package.json');

  const options = ['publish'];

  let message = `Publishing version ${version}`;
  if (packagePath) {
    // Ensure packagePath is a list
    if (typeof packagePath === 'string') {
      packagePath = [packagePath];
    }

    options.push('--packagePath', ...packagePath);
    message += ` from ${packagePath.join(', ')}`;
  } else {
    options.push(version, '--no-git-tag-version');

    if (isTargetEnabled()) {
      // @ts-ignore
      options.push('--target', process.env.VSCE_TARGET);
      message += ` for target ${process.env.VSCE_TARGET}`;
    }
  }

  const releases = [];
  if (vsceEnabled) {
    logger.log(message + ' to Visual Studio Marketplace');

    await execa('vsce', options, { stdio: 'inherit', preferLocal: true, cwd });
    const vsceUrl = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;

    logger.log(`The new version is available at ${vsceUrl}.`);
    releases.push({
      name: 'Visual Studio Marketplace',
      url: vsceUrl,
    });
  }

  if (ovsxEnabled) {
    logger.log(message + 'to Open VSX Registry');

    // When publishing to OpenVSX, packagePath will be always set
    await execa('ovsx', options, { stdio: 'inherit', preferLocal: true, cwd });
    const ovsxUrl = `https://open-vsx.org/extension/${publisher}/${name}/${version}`;

    logger.log(`The new ovsx version is available at ${ovsxUrl}`);
    releases.push({
      name: 'Open VSX Registry',
      url: ovsxUrl,
    });
  }

  // TODO: uncomment after https://github.com/semantic-release/semantic-release/issues/2123
  // return releases;
  return releases.shift();
};
