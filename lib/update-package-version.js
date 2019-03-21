const { writeJson, pathExists } = require('fs-extra');
const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const detectIndent = require('detect-indent');

module.exports = async (version, logger) => {
  const pkgRaw = (await readFile('./package.json')).toString();
  const pkg = JSON.parse(pkgRaw);
  const pkgIndent = detectIndent(pkgRaw).indent || '  ';

  await writeJson('./package.json', Object.assign(pkg, { version }), { spaces: pkgIndent });
  logger.log('Wrote version %s to package.json', version);

  if (await pathExists('./npm-shrinkwrap.json')) {
    const shrinkWrapRaw = (await readFile('./npm-shrinkwrap.json')).toString();
    const shrinkwrap = JSON.parse(shrinkWrapRaw);
    const shrinkWrapIndent = detectIndent(shrinkWrapRaw).indent || '  ';
    shrinkwrap.version = version;
    await writeJson('./npm-shrinkwrap.json', shrinkwrap, { spaces: shrinkWrapIndent });
    logger.log('Wrote version %s to npm-shrinkwrap.json', version);
  }
};
