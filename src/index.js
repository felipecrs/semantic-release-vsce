const {callbackify} = require('util');
const verify = require('./lib/verify');
const vscePublish = require('./lib/publish');
const getLastReleaseGallery = require('./lib/get-last-release');

let verified;

async function verifyConditions (pluginConfig, {pkg, logger}) {
  await verify(pkg, logger);
  verified = true;
}

async function getLastRelease (pluginConfig, {pkg, logger}) {
  if (!verified) {
    await verify(pkg, logger);
    verified = true;
  }
  return getLastReleaseGallery(pkg, logger);
}

async function publish (pluginConfig, {pkg, nextRelease: {version}, logger}) {
  if (!verified) {
    await verify(pkg, logger);
    verified = true;
  }
  await vscePublish(version, logger);
}

module.exports = {
  verifyConditions: callbackify(verifyConditions),
  getLastRelease: callbackify(getLastRelease),
  publish: callbackify(publish)
};
