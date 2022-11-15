// @ts-check

const execa = require('execa');
const { readJson } = require('fs-extra');
const { isOvsxEnabled, isTargetEnabled } = require('./utils');

module.exports = async (version, packagePath, logger, cwd) => {
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
  message += ' to Visual Studio Marketplace';
  logger.log(message);

  await execa('vsce', options, { stdio: 'inherit', preferLocal: true, cwd });

  const vsceUrl = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`The new version is available at ${vsceUrl}.`);

  const vsceRelease = {
    name: 'Visual Studio Marketplace',
    url: vsceUrl,
  };

  if (isOvsxEnabled()) {
    logger.log('Now publishing to OpenVSX');

    // When publishing to OpenVSX, packagePath will be always set
    await execa('ovsx', options, { stdio: 'inherit', preferLocal: true, cwd });
    const ovsxUrl = `https://open-vsx.org/extension/${publisher}/${name}/${version}`;

    logger.log(`The new ovsx version is available at ${ovsxUrl}`);

    // TODO: uncomment after https://github.com/semantic-release/semantic-release/issues/2123
    // const ovsxRelease = {
    //   name: 'Open VSX Registry',
    //   url: ovsxUrl
    // };

    // const releases = [vsceRelease, ovsxRelease];

    // return releases;
  }

  return vsceRelease;
};
