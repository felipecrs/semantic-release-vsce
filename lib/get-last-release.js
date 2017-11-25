const fetch = require('node-fetch');
const semver = require('semver');
const getPkg = require('read-pkg-up');
const registry = 'vs code marketplace';

/**
  References:
  * https://github.com/Microsoft/vscode/blob/master/src/vs/platform/extensionManagement/node/extensionGalleryService.ts#L423
  * https://github.com/Microsoft/vscode/blob/b00945fc8c79f6db74b280ef53eba060ed9a1388/product.json#L17-L21
*/

module.exports = async (logger) => {
  const {pkg: {name, publisher}} = await getPkg();
  const extensionId = `${publisher}.${name}`;
  logger.log(`Lookup extension details for "${extensionId}".`);
  const body = JSON.stringify({
    filters: [
      {
        pageNumber: 1,
        pageSize: 1,
        criteria: [
          { filterType: 7, value: extensionId }
        ]
      }
    ],
    'assetTypes': [],
    'flags': 512
  });

  const res = await fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
    method: 'POST',
    headers: {
      'Accept': 'application/json;api-version=3.0-preview.1',
      'Content-Type': 'application/json',
      'Content-Length': body.length
    },
    body
  });
  const { results = [] } = await res.json();
  const [ { extensions = [] } = {} ] = results;

  const [ {versions = []} ] = extensions.filter(({extensionName, publisher: { publisherName }}) => {
    return extensionId === `${publisherName}.${extensionName}`;
  });
  const [version] = versions
    .map(({ version }) => version)
    .sort(semver.compare)
    .reverse();

  if (!version) {
    logger.log('No version found of package %s found on %s', extensionId, registry);
    return {};
  }

  logger.log('Found version %s of package %s', version, extensionId);
  return {
    // gitHead: '', // xxx: info not available, let's fallback to git
    version
  };
};
