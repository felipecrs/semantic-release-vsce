// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import { execa } from 'execa';
import process from 'node:process';

export async function verifyOvsxAuth(logger, cwd) {
  logger.log('Verifying authentication for ovsx');

  if (!process.env.OVSX_PAT) {
    throw new SemanticReleaseError(
      'Empty ovsx personal access token (`OVSX_PAT` environment variable) specified.',
      'EEMPTYOVSXPAT',
    );
  }

  try {
    await execa('ovsx', ['verify-pat'], {
      preferLocal: true,
      localDir: import.meta.dirname,
      cwd,
    });
  } catch (error) {
    throw new SemanticReleaseError(
      `Invalid ovsx personal access token. Additional information:\n\n${error}`,
      'EINVALIDOVSXPAT',
    );
  }
}
