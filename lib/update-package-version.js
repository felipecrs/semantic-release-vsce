const { readJson, writeJson, pathExists } = require('fs-extra');
const path = require('path');

module.exports = async (version, pluginConfig, logger) => {
  const { pkgRoot } = pluginConfig;
  const packageJsonPath = path.join(pkgRoot || '.', 'package.json');
  const pkg = await readJson(packageJsonPath);

  await writeJson(packageJsonPath, Object.assign(pkg, { version }));
  logger.log('Wrote version %s to package.json', version);

  const shrinkwrapPath = path.join(pkgRoot || '.', 'npm-shrinkwrap.json');
  if (await pathExists(shrinkwrapPath)) {
    const shrinkwrap = await readJson(shrinkwrapPath);
    shrinkwrap.version = version;
    await writeJson(shrinkwrapPath, shrinkwrap);
    logger.log('Wrote version %s to npm-shrinkwrap.json', version);
  }
};
