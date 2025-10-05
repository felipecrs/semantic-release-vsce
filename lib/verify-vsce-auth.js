// @ts-check

import SemanticReleaseError from '@semantic-release/error';
import process from 'node:process';
import { isAzureCredentialEnabled } from './utilities.js';
import { verifyPat as vsceVerifyPat } from '@vscode/vsce/out/store.js';

export async function verifyVsceAuth(logger, cwd) {
  logger.log('Verifying authentication for vsce');

  const pat = process.env.VSCE_PAT;
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

  // TODO: Add type definitions to `@vscode/vsce`
  const options = {
    pat,
    azureCredential,
  };

  try {
    await vsceVerifyPat(options);
  } catch (error) {
    throw new SemanticReleaseError(
      `Invalid vsce personal access token or azure credential. Additional information:\n\n${error}`,
      'EINVALIDVSCEPAT',
    );
  }
}
