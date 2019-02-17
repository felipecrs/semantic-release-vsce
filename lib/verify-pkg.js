const SemanticReleaseError = require('@semantic-release/error');

module.exports = ({ name, publisher }) => {
  if (!name) {
    throw new SemanticReleaseError('No "name" found in package.json.', 'ENOPKGNAME');
  }
  if (!publisher) {
    throw new SemanticReleaseError('No "publisher" found in package.json.', 'ENOPUBLISHER');
  }
};
