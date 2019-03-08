const execa = require('execa');
const { readJson } = require('fs-extra');
const path = require('path');

module.exports = async (version, pluginConfig, logger) => {
  const { VSCE_TOKEN } = process.env;

  const { pkgRoot } = pluginConfig;
  const { publisher, name } = await readJson(path.join(pkgRoot || '.', 'package.json'));

  logger.log('Publishing version %s to vs code marketplace', version);
  await execa('vsce', ['publish', '--pat', VSCE_TOKEN], { stdio: 'inherit', cwd: pkgRoot });

  const url = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`New version is available at ${url}`);
  return {
    name: 'Visual Studio Marketplace',
    url
  };
};
