const {readJson, writeJson, pathExists} = require('fs-extra');
const execa = require('execa');
const debug = require('debug')('semantic-release:publish-meteor');
const {debugShell} = require('semantic-release/src/lib/debug');
const logger = require('semantic-release/src/lib/logger');

module.exports = async (pkg, {conf, registry, auth}, {version}) => {
  const pkgFile = await readJson('./package.json');
  const { VSCE_TOKEN } = process.env;

  if (await pathExists('./npm-shrinkwrap.json')) {
    const shrinkwrap = await readJson('./npm-shrinkwrap.json');
    shrinkwrap.version = version;
    await writeJson('./npm-shrinkwrap.json', shrinkwrap);
    logger.log('Wrote version %s to npm-shrinkwrap.json', version);
  }

  await writeJson('./package.json', Object.assign(pkgFile, {version}));
  logger.log('Wrote version %s to package.json', version);

  logger.log('Publishing version %s to vs code marketplace', version);
  const shell = await execa('vsce', ['publish', '-t', VSCE_TOKEN]);
  console.log(shell.stdout);
  debugShell('Publishing on vs code marketplace', shell, debug);
};
