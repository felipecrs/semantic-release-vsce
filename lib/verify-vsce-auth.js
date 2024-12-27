// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import { execa } from 'execa';
import process from 'node:process';
import { isAzureCredentialEnabled } from './utils.js';

export async function verifyVsceAuth(logger, cwd) {
  const pat = 'VSCE_PAT' in process.env && process.env.VSCE_PAT;
  const azureCredential = isAzureCredentialEnabled();

  if (!pat && !azureCredential) {
    throw new SemanticReleaseError(
      'Neither vsce personal access token (`VSCE_PAT` environment variable) or azure credential flag (`VSCE_AZURE_CREDENTIAL` environment variable) specified.',
      'EVSCEAUTHNOTPROVIDED',
    );
  }

  if (pat && azureCredential) {
    throw new SemanticReleaseError(
      'Both vsce personal access token (`VSCE_PAT` environment variable) and azure credential flag (`VSCE_AZURE_CREDENTIAL` environment variable) specified. Please use only one.',
      'EVSCEDUPLICATEAUTHPROVIDED',
    );
  }

  const vsceArgs = ['verify-pat'];
  if (azureCredential) {
    vsceArgs.push('--azure-credential');
  }

  try {
    await execa('vsce', vsceArgs, { preferLocal: true, cwd });
  } catch (e) {
    throw new SemanticReleaseError(
      `Invalid vsce personal access token or azure credential. Additional information:\n\n${e}`,
      'EINVALIDVSCEPAT',
    );
  }
}
