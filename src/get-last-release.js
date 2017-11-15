const registry = 'vs code marketplace';

module.exports = async ({publishConfig, name}, logger) => {
  const version = '';

  if (!version) {
    logger.log('No version found of package %s found on %s', name, registry);
    return {};
  }

  logger.log('Found version %s of package %s', version, name);
  return {
    // gitHead: '', // xxx: info not available, let's fallback
    version
  };
};
