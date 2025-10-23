// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import process from 'node:process';
import { verifyPat } from 'ovsx';

export async function verifyOvsxAuth(logger, cwd) {
  logger.log('Verifying authentication for ovsx');

  const pat = process.env.OVSX_PAT;

  if (!pat) {
    throw new SemanticReleaseError(
      'Empty ovsx personal access token (`OVSX_PAT` environment variable) specified.',
      'EEMPTYOVSXPAT',
    );
  }

  /** @type {import('ovsx').VerifyPatOptions} */
  const options = {
    pat,
  };

  try {
    await verifyPat(options);
  } catch (error) {
    throw new SemanticReleaseError(
      `Invalid ovsx personal access token. Additional information:\n\n${error}`,
      'EINVALIDOVSXPAT',
    );
  }
}
