// @ts-check

const { createError } = require('./error');
const { readJson } = require('fs-extra');
const fs = require('fs');

module.exports = async () => {
  if (!fs.existsSync('./package.json')) {
    throw await createError(
      'The `package.json` was not found. A `package.json` is required to release with vsce.',
      'ENOPKG',
    );
  }

  let packageJson;

  try {
    packageJson = await readJson('./package.json');
  } catch {
    throw await createError(
      'The `package.json` seems to be invalid.',
      'EINVALIDPKG',
    );
  }

  const { name, publisher } = packageJson;

  if (!name) {
    throw await createError('No `name` found in `package.json`.', 'ENOPKGNAME');
  }
  if (!publisher) {
    throw await createError(
      'No `publisher` found in `package.json`.',
      'ENOPUBLISHER',
    );
  }
};
