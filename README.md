# semantic-release-vsce

[![npm](https://img.shields.io/npm/v/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![downloads](https://img.shields.io/npm/dt/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![build](https://travis-ci.org/raix/semantic-release-vsce.svg?branch=master)](https://travis-ci.org/raix/semantic-release-vsce)
[![dependencies](https://david-dm.org/raix/semantic-release-vsce/status.svg)](https://david-dm.org/raix/semantic-release-vsce)
[![peerDependencies](https://david-dm.org/raix/semantic-release-vsce/peer-status.svg)](https://david-dm.org/raix/semantic-release-vsce?type=peer)
[![Greenkeeper](https://badges.greenkeeper.io/raix/semantic-release-vsce.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Semantic release plugin for Visual Stuio Code extensions

#### Add config to package.json

Use `semantic-release-vsce` as part of `verifyConditions` and `publish`.
For `getLastRelease` you should use `@semantic-release/git` (instead of the default npm implementation).

```json
{
  "scripts": {
    "semantic-release": "semantic-release"
  },
  "release": {
    "verifyConditions": ["semantic-release-vsce", "@semantic-release/github"],
    "getLastRelease": "@semantic-release/git",
    "publish": [
      {
        "path": "semantic-release-vsce",
        "packageVsix": "your-extension.vsix"
      },
      {
        "path": "@semantic-release/github",
        "assets": "your-extension.vsix"
      }
    ]
  },
  "devDependencies": {
    "@semantic-release/git": "^2.0.0",
    "semantic-release": "^12.0.0",
    "semantic-release-vsce": "^2.0.0",
  }
}
```

If `packageVsix` is set, will also generate a .vsix file at the set file path after publishing.
It is recommended to upload this to your GitHub release page so your users can easily rollback to an earlier version if a version ever introduces a bad bug. 

#### Travis example

Secret environment variables: `VSCE_TOKEN`

Example:

```yaml
# .travis.yml

cache:
  directories:
    - ~/.npm

script:
  - npm test

stages:
  - test
  - name: release
    if: branch = master AND type = push AND fork = false

jobs:
  include:
    - stage: release
      language: node_js
      node_js: '8'
      script: npm run semantic-release
```
