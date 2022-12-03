// @ts-check

const SemanticReleaseError = require('@semantic-release/error');
const execa = require('execa');
const { isOvsxEnabled } = require('./utils');

module.exports = async (logger, cwd) => {
  logger.log('Verifying authentication for ovsx');

  if (!isOvsxEnabled()) {
    logger.log(
      'Skipping verification of ovsx personal token because the `OVSX_PAT` environment variable is not set.\n\nDid you know you can easily start publishing to OpenVSX with `semantic-release-vsce`?\nLearn more at https://github.com/felipecrs/semantic-release-vsce#publishing-to-openvsx'
    );
    return;
  }

  if (!process.env.OVSX_PAT) {
    throw new SemanticReleaseError(
      'Empty ovsx personal access token specified.',
      'EINVALIDOVSXPAT'
    );
  }

  try {
    await execa('ovsx', ['verify-pat'], { preferLocal: true, cwd });
  } catch (e) {
    throw new SemanticReleaseError(
      `Invalid ovsx personal access token. Additional information:\n\n${e}`,
      'EINVALIDOVSXPAT'
    );
  }
};
