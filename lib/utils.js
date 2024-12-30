// @ts-check

import process from 'node:process';

function environmentToBoolean(name) {
  return process.env[name] === 'true' || process.env[name] === '1';
}

export function isOvsxPublishEnabled() {
  return 'OVSX_PAT' in process.env;
}

export function isAzureCredentialEnabled() {
  return environmentToBoolean('VSCE_AZURE_CREDENTIAL');
}

export function isVscePublishEnabled() {
  return 'VSCE_PAT' in process.env || isAzureCredentialEnabled();
}

export function isTargetEnabled() {
  return (
    'VSCE_TARGET' in process.env && process.env.VSCE_TARGET !== 'universal'
  );
}
