// @ts-check

import { readJson } from 'fs-extra/esm';
import path from 'node:path';
import process from 'node:process';
import {
  isAzureCredentialEnabled,
  isOvsxPublishEnabled,
  isTargetEnabled,
  isVscePublishEnabled,
} from './utilities.js';
import { publish as vscePublish } from '@vscode/vsce';
import { publish as ovsxPublish } from 'ovsx';

export async function publish(version, packagePath, logger, cwd) {
  const { publisher, name } = await readJson(path.join(cwd, './package.json'));

  /** @type {import('@vscode/vsce').IPublishOptions} */
  const vsceOptions = {
    cwd,
    pat: process.env.VSCE_PAT,
    azureCredential: isAzureCredentialEnabled(),
  };
  /** @type {import('ovsx').PublishOptions} */
  const ovsxOptions = {
    // cwd is not relevant for ovsx as we always provide packagePath
    pat: process.env.OVSX_PAT,
  };

  let message = `Publishing version ${version}`;
  if (packagePath) {
    // Ensure packagePath is a list
    if (typeof packagePath === 'string') {
      packagePath = [packagePath];
    }

    // @ts-expect-error https://github.com/microsoft/vscode-vsce/pull/1204
    vsceOptions.packagePath = packagePath;
    ovsxOptions.packagePath = packagePath;
    message += ` from ${packagePath.join(', ')}`;
  } else {
    // @ts-expect-error https://github.com/microsoft/vscode-vsce/pull/1204
    vsceOptions.gitTagVersion = false;

    if (isTargetEnabled()) {
      /** @type {string} */
      // @ts-expect-error VSCE_TARGET will be string if isTargetEnabled is true
      const target = process.env.VSCE_TARGET;
      // @ts-expect-error https://github.com/microsoft/vscode-vsce/pull/1204
      vsceOptions.targets = [target];
      ovsxOptions.targets = [target];
      message += ` for target ${target}`;
    }
  }

  const releases = [];
  if (isVscePublishEnabled()) {
    logger.log(message + ' to Visual Studio Marketplace');

    await vscePublish(vsceOptions);
    const vsceUrl = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;

    logger.log(`The new version is available at ${vsceUrl}.`);
    releases.push({
      name: 'Visual Studio Marketplace',
      url: vsceUrl,
    });
  }

  if (isOvsxPublishEnabled()) {
    logger.log(message + 'to Open VSX Registry');

    // When publishing to OpenVSX, packagePath will be always set
    await ovsxPublish(ovsxOptions);
    const ovsxUrl = `https://open-vsx.org/extension/${publisher}/${name}/${version}`;

    logger.log(`The new ovsx version is available at ${ovsxUrl}`);
    releases.push({
      name: 'Open VSX Registry',
      url: ovsxUrl,
    });
  }

  // TODO: uncomment after https://github.com/semantic-release/semantic-release/issues/2123
  // return releases;
  return releases.shift();
}
