import { execa } from 'execa';
import SemanticReleaseError from '@semantic-release/error';

export default async (logger) => {
  logger.log('Verifying authentication for vsce');

  if (!('VSCE_PAT' in process.env) && ('VSCE_TOKEN' in process.env)) {
    logger.log('VSCE_TOKEN is deprecated and may be removed in the next major release, please use VSCE_PAT instead.');
    process.env.VSCE_PAT = process.env.VSCE_TOKEN;
  }

  if (!process.env.VSCE_PAT) {
    throw new SemanticReleaseError('No vsce personal access token specified (set the `VSCE_PAT` environment variable).', 'ENOVSCEPAT');
  }

  try {
    await execa('vsce', ['verify-pat']);
  } catch (e) {
    throw new SemanticReleaseError(`Invalid vsce token. Additional information:\n\n${e}`, 'EINVALIDVSCETOKEN');
  }
};
