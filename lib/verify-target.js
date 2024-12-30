// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import process from 'node:process';
import { isTargetEnabled } from './utils.js';

export async function verifyTarget() {
  if (!isTargetEnabled()) {
    return;
  }

  if (!process.env.VSCE_TARGET) {
    throw new SemanticReleaseError(
      'Empty vsce target specified.',
      'EINVALIDVSCETARGET',
    );
  }

  if (process.env.VSCE_TARGET !== 'universal') {
    const vscePackage = await import('@vscode/vsce/out/package.js');
    const targets = vscePackage.Targets;

    // Throw if the target is not supported
    if (!targets.has(process.env.VSCE_TARGET)) {
      throw new SemanticReleaseError(
        `Unsupported vsce target: ${
          process.env.VSCE_TARGET
        }. Available targets: ${Object.values(targets).join(', ')}`,
        'EUNSUPPORTEDVSCETARGET',
      );
    }
  }
}
