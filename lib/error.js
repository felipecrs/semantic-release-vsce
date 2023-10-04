// @ts-check

const createError = async (message, code) => {
  const SemanticReleaseError = (await import('@semantic-release/error'))
    .default;
  return new SemanticReleaseError(message, code);
};

module.exports = {
  createError,
};
