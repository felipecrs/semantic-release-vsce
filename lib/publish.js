const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, logger) => {
  const { VSCE_TOKEN } = process.env;

  await updatePackageVersion(version, logger);

  logger.log('Publishing version %s to vs code marketplace', version);
  const shell = await execa('vsce', ['publish', '-t', VSCE_TOKEN]);
  process.stdout.write(shell.stdout);
};
