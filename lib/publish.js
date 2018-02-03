const execa = require('execa');

module.exports = async (version, logger) => {
  const { VSCE_TOKEN } = process.env;

  logger.log('Publishing version %s to vs code marketplace', version);
  await execa('vsce', ['publish', '--pat', VSCE_TOKEN], {stdio: 'inherit'});
};
