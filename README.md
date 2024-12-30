# semantic-release-vsce

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to package and publish VS Code extensions.

[![npm](https://img.shields.io/npm/v/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![downloads](https://img.shields.io/npm/dt/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![ci](https://github.com/felipecrs/semantic-release-vsce/workflows/ci/badge.svg)](https://github.com/felipecrs/semantic-release-vsce/actions?query=workflow%3Aci)
[![dependencies](https://david-dm.org/felipecrs/semantic-release-vsce/status.svg)](https://david-dm.org/felipecrs/semantic-release-vsce)
[![peerDependencies](https://david-dm.org/felipecrs/semantic-release-vsce/peer-status.svg)](https://david-dm.org/felipecrs/semantic-release-vsce?type=peer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

| Step      | Description                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify`  | Verify the `package.json` and the validity of the personal access tokens against Visual Studio Marketplace and/or Open VSX Registry when publish is enabled |
| `prepare` | Generate the `.vsix` file using `vsce` (can be be controlled by the [`packageVsix` config option](#packagevsix)                                             |
| `publish` | Publish the extension to Visual Studio Marketplace and/or Open VSX Registry (learn more [here](#publishing))                                                |

## Install

```console
npm install --save-dev semantic-release-vsce
```

or

```console
yarn add --dev semantic-release-vsce
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "semantic-release-vsce",
      {
        "packageVsix": true
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": [
          {
            "path": "*.vsix"
          }
        ]
      }
    ]
  ]
}
```

## Configuration

### `packageVsix`

Whether to package or not the extension into a `.vsix` file, or where to place it. This controls if `vsce package` gets called or not, and what value will be used for `vsce package --out`.

| Value              | Description                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `"auto"` (default) | behave as `true` in case [`publish`](#publish) is disabled or the `OVSX_PAT` environment variable is present |
| `true`             | package the extension `.vsix`, and place it at the current working directory                                 |
| `false`            | disables packaging the extension `.vsix` entirely                                                            |
| a `string`         | package the extension `.vsix` and place it at the specified path                                             |

### `publish`

Whether to publish or not the extension to Visual Studio Marketplace and/or to Open VSX Registry. This controls if `vsce publish` or `ovsx publish` gets called or not. Learn more [here](#publishing).

| Value            | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `true` (default) | publishes the extension to Visual Studio Marketplace and/or to Open VSX Registry           |
| `false`          | disables publishing the extension to Visual Studio Marketplace and/or to Open VSX Registry |

### `publishPackagePath`

Which `.vsix` file (or files) to publish. This controls what value will be used for `vsce publish --packagePath`.

| Value              | Description                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `"auto"` (default) | uses the `.vsix` packaged during the `prepare` step (if packaged), or behave as `false` otherwise                 |
| `false`            | do not use a `.vsix` file to publish, which causes `vsce` to package the extension as part of the publish process |
| a `string`         | publish the specified `.vsix` file(s). This can be a glob pattern, or a comma-separated list of files             |

### `packageRoot`

The directory of the extension relative to the current working directory. Defaults to `cwd`.

### Environment variables

The following environment variables are supported by this plugin:

| Variable                | Description                                                                                                                                                                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OVSX_PAT`              | _Optional_. The personal access token to push to Open VSX Registry                                                                                                                                                                                                                                              |
| `VSCE_PAT`              | _Optional_. The personal access token to publish to Visual Studio Marketplace. _Note:_ Cannot be set at the same time as `VSCE_AZURE_CREDENTIAL`.                                                                                                                                                               |
| `VSCE_AZURE_CREDENTIAL` | _Optional_. When set to `true` or `1`, `vsce` will use the `--azure-credential` flag to authenticate. _Note:_ Cannot be set at the same time as `VSCE_PAT`.                                                                                                                                                     |
| `VSCE_TARGET`           | _Optional_. The target to use when packaging or publishing the extension (used as `vsce package --target ${VSCE_TARGET}`). When set to `universal`, behave as if `VSCE_TARGET` was not set (i.e. build the universal/generic `vsix`). See [the platform-specific example](#platform-specific-on-github-actions) |

### Configuring `vsce`

You can set `vsce` options in the `package.json`, like:

```json
{
  "vsce": {
    "baseImagesUrl": "https://my.custom/base/images/url",
    "dependencies": true,
    "yarn": false
  }
}
```

For more information, check the [`vsce` docs](https://github.com/microsoft/vscode-vsce#configuration).

## Publishing

This plugin can publish extensions to Visual Studio Marketplace and/or Open VSX Registry.

You can enable or disable publishing with the [`publish`](#publish) config option.

When publish is enabled (default), the plugin will publish to Visual Studio Marketplace if the `VSCE_PAT` environment variable is present, and/or to Open VSX Registry if the `OVSX_PAT` environment variable is present.

For example, you may want to disable publishing if you only want to publish the `.vsix` file as a GitHub release asset.

### Publishing to Visual Studio Marketplace

Publishing extensions to Visual Studio Marketplace using this plugin is easy:

1. Create your personal access token for Visual Studio Marketplace. Learn more [here](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token).

2. Configure the `VSCE_PAT` environment variable in your CI with the token that you created.

3. Enjoy! The plugin will automatically detect the environment variable and it will publish to Visual Studio Marketplace, no additional configuration is needed.

### Publishing to Open VSX Registry

Publishing extensions to Open VSX Registry using this plugin is easy:

1. Create your personal access token for Open VSX Registry. Learn more [here](https://github.com/eclipse/openvsx/wiki).

2. Configure the `OVSX_PAT` environment variable in your CI with the token that you created.

3. Enjoy! The plugin will automatically detect the environment variable and it will publish to Open VSX Registry, no additional configuration is needed.

## Examples

### GitHub Actions

```yaml
name: release

on:
  push:
    branches:
      - master

permissions:
  contents: read # for checkout

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write # to be able to publish a GitHub release
      issues: write # to be able to comment on released issues
      pull-requests: write # to be able to comment on released pull requests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm audit signatures
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # In case you want to publish to Visual Studio Marketplace
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          # In case you want to publish to Open VSX Registry
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
```

### Platform-specific on GitHub Actions

1. Install [`semantic-release-stop-before-publish`](https://github.com/felipecrs/semantic-release-stop-before-publish)

   ```console
   npm install --save-dev semantic-release-stop-before-publish
   ```

   We will use it to make `semantic-release` stop before publishing anything, so that we can use `semantic-release` to build each `.vsix` in a matrix.

2. Separate your `semantic-release` configuration into two, one for packaging and another for publishing.

   The one for packaging has `semantic-release-stop-before-publish` so that `semantic-release` does not publish anything (which includes the git tag).

   ```js
   // package.release.config.js
   /**
    * @type {import('semantic-release').GlobalConfig}
    */
   export default {
     plugins: [
       '@semantic-release/commit-analyzer',
       '@semantic-release/release-notes-generator',
       [
         'semantic-release-vsce',
         {
           packageVsix: true,
           publish: false, // no-op since we use semantic-release-stop-before-publish
         },
       ],
       'semantic-release-stop-before-publish',
     ],
   };
   ```

   The one for publishing does not package the `.vsix`, but publishes all the `*.vsix` files.

   ```js
   // publish.release.config.js
   /**
    * @type {import('semantic-release').GlobalConfig}
    */
   export default {
     plugins: [
       '@semantic-release/commit-analyzer',
       '@semantic-release/release-notes-generator',
       [
         'semantic-release-vsce',
         {
           packageVsix: false,
           publishPackagePath: '*.vsix',
         },
       ],
       [
         '@semantic-release/github',
         {
           assets: '*.vsix',
         },
       ],
     ],
   };
   ```

   > **Note:** do not forget to remove your existing `semantic-release` configuration.

3. Create a workflow file like below:

```yaml
# .github/workflows/ci.yaml
name: ci

on:
  push:
    branches:
      - master

permissions:
  contents: read # for checkout

jobs:
  build:
    strategy:
      matrix:
        include:
          - os: windows-latest
            target: win32-x64
            npm_config_arch: x64
          - os: windows-latest
            target: win32-arm64
            npm_config_arch: arm
          - os: ubuntu-latest
            target: linux-x64
            npm_config_arch: x64
          - os: ubuntu-latest
            target: linux-arm64
            npm_config_arch: arm64
          - os: ubuntu-latest
            target: linux-armhf
            npm_config_arch: arm
          - os: ubuntu-latest
            target: alpine-x64
            npm_config_arch: x64
          - os: ubuntu-latest
            target: alpine-arm64
            npm_config_arch: arm64
          - os: macos-latest
            target: darwin-x64
            npm_config_arch: x64
          - os: macos-latest
            target: darwin-arm64
            npm_config_arch: arm64
          - os: ubuntu-latest
            target: universal
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - if: matrix.target != 'universal'
        name: Install dependencies (with binaries)
        run: npm ci
        env:
          npm_config_arch: ${{ matrix.npm_config_arch }}
      - if: matrix.target == 'universal'
        name: Install dependencies (without binaries)
        run: npm ci
      - run: npx semantic-release --extends ./package.release.config.js
        env:
          VSCE_TARGET: ${{ matrix.target }}
          # All tokens are required since semantic-release needs to validate them
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # In case you want to publish to Visual Studio Marketplace
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          # In case you want to publish to Open VSX Registry
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.target }}
          path: '*.vsix'

  release:
    runs-on: ubuntu-latest
    needs: build
    permissions:
      contents: write # to be able to publish a GitHub release
      issues: write # to be able to comment on released issues
      pull-requests: write # to be able to comment on released pull requests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          merge-multiple: true
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm audit signatures
      - run: npx semantic-release --extends ./publish.release.config.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # In case you want to publish to Visual Studio Marketplace
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          # In case you want to publish to Open VSX Registry
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
```

### GitHub Actions - Release to VS Marketplace with Azure credentials

```yaml
name: release

on:
  push:
    branches:
      - master

permissions:
  contents: read # for checkout

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write # to be able to publish a GitHub release
      issues: write # to be able to comment on released issues
      pull-requests: write # to be able to comment on released pull requests
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm audit signatures
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VSCE_AZURE_CREDENTIAL: 'true'
```

A reference implementation can also be found in the [VS Code ShellCheck extension](https://github.com/vscode-shellcheck/vscode-shellcheck/pull/805).
