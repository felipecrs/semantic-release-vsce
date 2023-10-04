// @ts-check

const { createError } = require('./error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for vsce');

  if (!process.env.VSCE_PAT) {
    throw await createError(
      'Empty vsce personal access token (`VSCE_PAT` environment variable) specified.',
      'EEMPTYVSCEPAT',
    );
  }

  try {
    await execa('vsce', ['verify-pat'], { preferLocal: true, cwd });
  } catch (e) {
    throw await createError(
      `Invalid vsce personal access token. Additional information:\n\n${e}`,
      'EINVALIDVSCEPAT',
    );
  }
};
