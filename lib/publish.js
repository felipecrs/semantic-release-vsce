const execa = require('execa');
const { readJson } = require('fs-extra');
const { isOvsxEnabled } = require('./verify-ovsx-auth');

module.exports = async ({ nextRelease: { version }, logger, cwd }, packagePath) => {
  const { publisher, name } = await readJson('./package.json');

  const options = ['publish'];

  if (packagePath) {
    logger.log(`Publishing version ${version} from ${packagePath} to Visual Studio Marketplace`);
    options.push(...['--packagePath', packagePath]);
  } else {
    logger.log(`Publishing version ${version} to Visual Studio Marketplace`);
    options.push(...[version, '--no-git-tag-version']);
  }

  await execa('vsce', options, { stdio: 'inherit', cwd });

  const vsceUrl = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`The new version is available at ${vsceUrl}.`);

  const vsceRelease = {
    name: 'Visual Studio Marketplace',
    url: vsceUrl
  };

  if (isOvsxEnabled()) {
    logger.log('Now publishing to OpenVSX');

    await execa('ovsx', ['publish', packagePath], { stdio: 'inherit', cwd });
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
