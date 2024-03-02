// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const { readJson } = require('fs-extra');
const fs = require('fs');
const path = require('path');

module.exports = async (cwd) => {
  const packagePath = path.join(cwd, './package.json');

  if (!fs.existsSync(packagePath)) {
    throw new SemanticReleaseError(
      `${packagePath} was not found. A \`package.json\` is required to release with vsce.`,
      'ENOPKG',
    );
  }

  let packageJson;

  try {
    packageJson = await readJson(packagePath);
  } catch {
    throw new SemanticReleaseError(
      'The `package.json` seems to be invalid.',
      'EINVALIDPKG',
    );
  }

  const { name, publisher } = packageJson;

  if (!name) {
    throw new SemanticReleaseError(
      'No `name` found in `package.json`.',
      'ENOPKGNAME',
    );
  }
  if (!publisher) {
    throw new SemanticReleaseError(
      'No `publisher` found in `package.json`.',
      'ENOPUBLISHER',
    );
  }
};
