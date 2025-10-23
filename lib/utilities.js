// @ts-check

import process from 'node:process';

function environmentToBoolean(name) {
  return process.env[name] === 'true' || process.env[name] === '1';
}

export function isOvsxPublishEnabled() {
  return !!process.env.OVSX_PAT;
}

export function isAzureCredentialEnabled() {
  return environmentToBoolean('VSCE_AZURE_CREDENTIAL');
}

export function isVscePublishEnabled() {
  return !!process.env.VSCE_PAT || isAzureCredentialEnabled();
}

export function isTargetEnabled() {
  return !!process.env.VSCE_TARGET && process.env.VSCE_TARGET !== 'universal';
}
