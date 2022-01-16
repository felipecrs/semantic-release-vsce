import verifyVsce from './lib/verify';
import vscePublish from './lib/publish';
import vscePrepare from './lib/prepare';

let verified = false;
let prepared = false;
let packagePath;

export async function verifyConditions (pluginConfig, { logger }) {
  await verifyVsce(logger);
  verified = true;
}

export async function prepare (pluginConfig, { nextRelease: { version }, logger }) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }
  packagePath = await vscePrepare(version, pluginConfig.packageVsix, pluginConfig.yarn, logger);
  prepared = true;
}

export async function publish (pluginConfig, { nextRelease: { version }, logger }) {
  if (!verified) {
    await verifyVsce(logger);
    verified = true;
  }

  if (!prepared) {
    // BC: prior to semantic-release v15 prepare was part of publish
    packagePath = await vscePrepare(version, pluginConfig.packageVsix, pluginConfig.yarn, logger);
  }
  return vscePublish(version, packagePath, pluginConfig.yarn, logger);
}
