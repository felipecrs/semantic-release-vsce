const verifyVsce = require('./lib/verify');
const vscePublish = require('./lib/publish');
const getLastReleaseGallery = require('./lib/get-last-release');

let verified;

async function verifyConditions (pluginConfig, {logger}) {
  await verifyVsce(logger);
  verified = true;
}

async function getLastRelease (pluginConfig, {logger}) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }
  return getLastReleaseGallery(logger);
}

async function publish (pluginConfig, {nextRelease: {version}, logger}) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }
  await vscePublish(version, pluginConfig.packageVsix, logger);
}

module.exports = {
  verifyConditions,
  getLastRelease,
  publish
};
