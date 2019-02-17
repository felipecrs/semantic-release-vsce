const execa = require('execa');
const { readJson } = require('fs-extra');

module.exports = async (version, logger) => {
  const { VSCE_TOKEN } = process.env;

  const { publisher, name } = await readJson('./package.json');

  logger.log('Publishing version %s to vs code marketplace', version);
  await execa('vsce', ['publish', '--pat', VSCE_TOKEN], { stdio: 'inherit' });

  const url = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`New version is available at ${url}`);
  return {
    name: 'Visual Studio Marketplace',
    url
  };
};
