const execa = require('execa');
const { readJson } = require('fs-extra');

module.exports = async (version, packagePath, yarn, logger) => {
  const { publisher, name } = await readJson('./package.json');

  const options = ['publish'];

  if (packagePath) {
    logger.log(`Publishing version ${version} from ${packagePath} to Visual Studio Marketplace`);
    options.push(...['--packagePath', packagePath]);
  } else {
    logger.log(`Publishing version ${version} to Visual Studio Marketplace`);
    options.push(...[version, '--no-git-tag-version']);
  }

  if (yarn) {
    options.push('--yarn');
  }

  await execa('vsce', options, { stdio: 'inherit' });

  const url = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`The new version is available at ${url}`);
  return {
    name: 'Visual Studio Marketplace',
    url
  };
};
