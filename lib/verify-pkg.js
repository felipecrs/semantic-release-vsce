// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import { pathExists, readJson } from 'fs-extra/esm';
import { join } from 'node:path';

export async function verifyPkg(cwd) {
  const packagePath = join(cwd, './package.json');

  if (!(await pathExists(packagePath))) {
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
}
