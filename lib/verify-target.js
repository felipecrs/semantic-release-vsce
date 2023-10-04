// @ts-check

const { createError } = require('./error');
const { isTargetEnabled } = require('./utils');

module.exports = async () => {
  if (!isTargetEnabled()) {
    return;
  }

  if (!process.env.VSCE_TARGET) {
    throw await createError(
      'Empty vsce target specified.',
      'EINVALIDVSCETARGET',
    );
  }

  if (process.env.VSCE_TARGET !== 'universal') {
    const targets = require('@vscode/vsce/out/package').Targets;

    // Throw if the target is not supported
    if (!targets.has(process.env.VSCE_TARGET)) {
      throw await createError(
        `Unsupported vsce target: ${
          process.env.VSCE_TARGET
        }. Available targets: ${Object.values(targets).join(', ')}`,
        'EUNSUPPORTEDVSCETARGET',
      );
    }
  }
};
