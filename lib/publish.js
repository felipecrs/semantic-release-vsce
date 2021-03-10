const execa = require('execa');
const { readJson } = require('fs-extra');

module.exports = async (version, yarn, logger) => {
  const { VSCE_TOKEN, VSCE_PAT } = process.env;

  const { publisher, name } = await readJson('./package.json');

  logger.log('Publishing version %s to vs code marketplace', version);

  const options = ['publish'];

  if (!VSCE_PAT && VSCE_TOKEN) {
    options.push('--pat', VSCE_TOKEN);
  }

  if (yarn) {
    options.push('--yarn');
  }

  await execa('vsce', options, { stdio: 'inherit' });

  const url = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`New version is available at ${url}`);
  return {
    name: 'Visual Studio Marketplace',
    url
  };
};
