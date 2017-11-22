# semantic-release-vsce

[![Build Status](https://travis-ci.org/raix/semantic-release-vsce.svg?branch=master)](https://travis-ci.org/raix/semantic-release-vsce)
[![Greenkeeper badge](https://badges.greenkeeper.io/raix/semantic-release-vsce.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Semantic release plugin for vs code extensions

NOTE: This package is still experimental - `semantic-release` multi plugins are not released

#### Add config to package.json

```json
{
  "scripts": {
    "semantic-release": "semantic-release pre && npm publish && semantic-release post"
  },
  "release": {
    "verifyConditions": [
      "@semantic-release/travis",
      "semantic-release-vsce",
      "@semantic-release/github"
    ],
    "getLastRelease": "semantic-release-vsce",
    "analyzeCommits": "@semantic-release/conventional-changelog",
    "verifyRelease": [
      "@semantic-release/lts"
    ],
    "generateNotes" : "@semantic-release/conventional-changelog",
    "publish": [
      "semantic-release-vsce",
      "@semantic-release/github"
    ]
  },
  "devDependencies": {
    "semantic-release": "x.x.x"
  }
}
```

#### Travis example

Environment variables:
```
  VSCE_TOKEN=""
```

Example:
```yaml
# .travis.yml
language: node_js
cache:
  directories:
    - ~/.npm
    - "node_modules"
node_js:
  - '8'
install:
  - npm install
stages:
  - test
  - name: publish
    if: brance = master
script:
  - npm test
jobs:
  include:
    - stage: publish
    - script: npm run semantic-release
```
