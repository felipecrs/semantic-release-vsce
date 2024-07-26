// @ts-check

const isOvsxPublishEnabled = () => {
  return 'OVSX_PAT' in process.env;
};

const isVscePublishEnabled = () => {
  return 'VSCE_PAT' in process.env || 'VSCE_USE_AZURE_CREDENTIALS' in process.env;
};

const isTargetEnabled = () => {
  return (
    'VSCE_TARGET' in process.env && process.env.VSCE_TARGET !== 'universal'
  );
};

module.exports = {
  isTargetEnabled,
  isOvsxPublishEnabled,
  isVscePublishEnabled,
};
