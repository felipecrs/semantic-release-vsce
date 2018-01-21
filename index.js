const verifyVsce = require('./lib/verify');
const vscePublish = require('./lib/publish');

let verified;

async function verifyConditions (pluginConfig, {logger}) {
  await verifyVsce(logger);
  verified = true;
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
  publish
};
