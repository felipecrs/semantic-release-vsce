// @ts-check

const { createError } = require('./error');
const execa = require('execa');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for ovsx');

  if (!process.env.OVSX_PAT) {
    throw await createError(
      'Empty ovsx personal access token (`OVSX_PAT` environment variable) specified.',
      'EEMPTYOVSXPAT',
    );
  }

  try {
    await execa('ovsx', ['verify-pat'], { preferLocal: true, cwd });
  } catch (e) {
    throw await createError(
      `Invalid ovsx personal access token. Additional information:\n\n${e}`,
      'EINVALIDOVSXPAT',
    );
  }
};
