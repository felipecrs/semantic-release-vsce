// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const { readJson } = require('fs-extra');
const fs = require('fs');

module.exports = async () => {
  if (!fs.existsSync('./package.json')) {
    throw new SemanticReleaseError(
      'The `package.json` was not found. A `package.json` is required to release with vsce.',
      'ENOPKG'
    );
  }

  let packageJson;

  try {
    packageJson = await readJson('./package.json');
  } catch (error) {
    throw new SemanticReleaseError(
      'The `package.json` seems to be invalid.',
      'EINVALIDPKG'
    );
  }

  const { name, publisher } = packageJson;

  if (!name) {
    throw new SemanticReleaseError(
      'No `name` found in `package.json`.',
      'ENOPKGNAME'
    );
  }
  if (!publisher) {
    throw new SemanticReleaseError(
      'No `publisher` found in `package.json`.',
      'ENOPUBLISHER'
    );
  }
};
