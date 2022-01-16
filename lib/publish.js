import { execa } from 'execa';
import { readJson } from 'fs-extra';
import { isOvsxEnabled } from './verify-ovsx-auth';

export default async (version, packagePath, yarn, logger) => {
  const { publisher, name } = await readJson('./package.json');

  const options = ['publish'];

  if (packagePath) {
    logger.log(`Publishing version ${version} from ${packagePath} to Visual Studio Marketplace`);
    options.push(...['--packagePath', packagePath]);
  } else {
    logger.log(`Publishing version ${version} to Visual Studio Marketplace`);
    options.push(...[version, '--no-git-tag-version']);
  }

  if (yarn) {
    options.push('--yarn');
  }

  await execa('vsce', options, { stdio: 'inherit' });

  const vsceUrl = `https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`;
  logger.log(`The new version is available at ${vsceUrl}.`);

  const vsceRelease = {
    name: 'Visual Studio Marketplace',
    url: vsceUrl
  };

  if (isOvsxEnabled()) {
    logger.log('Now publishing to OpenVSX');

    await execa('ovsx', ['publish', packagePath], { stdio: 'inherit' });

    // TODO: uncomment after https://github.com/semantic-release/semantic-release/issues/2123
    // const ovsxUrl = `https://open-vsx.org/extension/${publisher}/${name}/${version}`;
    // const ovsxRelease = {
    //   name: 'Open VSX Registry',
    //   url: ovsxUrl
    // };

    // const releases = [vsceRelease, ovsxRelease];

    // return releases;
  }

  return vsceRelease;
};
