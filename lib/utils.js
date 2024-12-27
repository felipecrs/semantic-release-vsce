// @ts-check

const envToBoolean = (name) => {
  return process.env[name] === 'true' || process.env[name] === '1';
};

const isOvsxPublishEnabled = () => {
  return 'OVSX_PAT' in process.env;
};

const isAzureCredentialEnabled = () => {
  return envToBoolean('VSCE_AZURE_CREDENTIAL');
};

const isVscePublishEnabled = () => {
  return 'VSCE_PAT' in process.env || isAzureCredentialEnabled();
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
  isAzureCredentialEnabled,
};
