const {callbackify} = require('util');
const verify = require('./lib/verify');
const publish = require('./lib/publish');
const getLastReleaseMeteor = require('./lib/get-last-release');

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
  return getLastReleaseMeteor(pkg, logger);
}

async function publish (pluginConfig, {pkg, nextRelease: {version}, logger}) {
  if (!verified) {
    await verify(pkg, logger);
    verified = true;
  }
  await publish(version, logger);
}

module.exports = {
  verifyConditions: callbackify(verifyConditions),
  getLastRelease: callbackify(getLastRelease),
  publish: callbackify(publish)
};
