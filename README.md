# semantic-release-vsce

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to package and publish VS Code extensions.

[![npm](https://img.shields.io/npm/v/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![downloads](https://img.shields.io/npm/dt/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![ci](https://github.com/felipecrs/semantic-release-vsce/workflows/ci/badge.svg)](https://github.com/felipecrs/semantic-release-vsce/actions?query=workflow%3Aci)
[![dependencies](https://david-dm.org/felipecrs/semantic-release-vsce/status.svg)](https://david-dm.org/felipecrs/semantic-release-vsce)
[![peerDependencies](https://david-dm.org/felipecrs/semantic-release-vsce/peer-status.svg)](https://david-dm.org/felipecrs/semantic-release-vsce?type=peer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

| Step      | Description                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify`  | Verify the presence and the validity of the authentication (set via [environment variables](#environment-variables)) and the `package.json`                                                                          |
| `prepare` | Generate the `.vsix` file using vsce, this can be be controlled by providing `packageVsix` in config. <br/> _Note: If the `OVSX_PAT` environment variable is set, this step will run even if not explicitly enabled_ |
| `publish` | Publish the extension                                                                                                                                                                                                |

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

Whether to package or not the extension `.vsix`, or where to place it. This controls if `vsce package` gets called or not, and what value will be used for `vsce package --out`.

| Value              | Description                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `"auto"` (default) | behave as `true` in case [`publish`](#publish) is disabled or the `OVSX_PAT` environment variable is present |
| `true`             | package the extension `.vsix`, and place it at the current working directory                                 |
| `false`            | disables packaging the extension `.vsix` entirely                                                            |
| a `string`         | package the extension `.vsix` and place it at the specified path                                             |

### `publish`

Whether to publish or not the extension to Visual Studio Marketplace or OpenVSX (if the `OVSX_PAT` environment variable is present). This controls if `vsce publish` or `ovsx publish` (if the `OVSX_PAT` environment variable is present) gets called or not.

| Value            | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `true` (default) | publishes the extension to Visual Studio Marketplace           |
| `false`          | disables publishing the extension to Visual Studio Marketplace |

### `publishPackagePath`

Which `.vsix` file (or files) to publish. This controls what value will be used for `vsce publish --packagePath`.

| Value              | Description                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `"auto"` (default) | uses the `.vsix` packaged during the `prepare` step (if packaged), or behave as `false` otherwise                                                 |
| `false`            | do not use a `.vsix` file to publish, which causes `vsce` to package the extension as part of the publish process |
| a `string`         | publish the specified `.vsix` file(s). This can be a glob pattern, or a comma-separated list of files             |

### Environment variables

| Variable   | Description                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `VSCE_PAT` | **Required** (unless `publish` is set to `false`). The personal access token to publish the extension to Visual Studio Marketplace |
| `OVSX_PAT` | _Optional_. The personal access token to push to OpenVSX                                                                           |

### Publishing to OpenVSX

Publishing extensions to OpenVSX using this plugin is easy:

1. Get a valid personal access token with the correct privileges to the publisher namespace in OpenVSX. In order to get the personal access token, check this [page](https://github.com/eclipse/openvsx/wiki).

2. Configure the `OVSX_PAT` environment variable in your CI with the token that you created.

3. Enjoy! The plugin will automatically detect the environment variable and it will publish to OpenVSX, no additional configuration is needed.

## Examples

### Github Actions

```yaml
name: release

on:
  push:
    branches: [master]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          # In case you want to publish to OpenVSX
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
```

### Platform-specific on GitHub Actions

```console
npm install --save-dev semantic-release-export-data
```

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "semantic-release-export-data",
    [
      "semantic-release-vsce",
      {
        "packageVsix": false,
        "publishPackagePath": "*.vsix"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": "*.vsix"
      }
    ]
  ]
}
```

```yaml
# .github/workflows/ci.yaml
name: ci

on:
  push:
    branches: [master]

jobs:
  get-next-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npx semantic-release --dry-run
        id: get-next-version
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          # In case you want to publish to OpenVSX
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
    outputs:
      new-release-published: ${{ steps.get-next-version.outputs.new-release-published }}
      new-release-version: ${{ steps.get-next-version.outputs.new-release-version }}

  build:
    needs: get-next-version
    if: needs.get-next-version.outputs.new-release-published == 'true'
    strategy:
      matrix:
        include:
          - os: windows-latest
            platform: win32
            arch: x64
            npm_config_arch: x64
          - os: windows-latest
            platform: win32
            arch: ia32
            npm_config_arch: ia32
          - os: windows-latest
            platform: win32
            arch: arm64
            npm_config_arch: arm
          - os: ubuntu-latest
            platform: linux
            arch: x64
            npm_config_arch: x64
          - os: ubuntu-latest
            platform: linux
            arch: arm64
            npm_config_arch: arm64
          - os: ubuntu-latest
            platform: linux
            arch: armhf
            npm_config_arch: arm
          - os: ubuntu-latest
            platform: alpine
            arch: x64
            npm_config_arch: x64
          - os: macos-latest
            platform: darwin
            arch: x64
            npm_config_arch: x64
          - os: macos-latest
            platform: darwin
            arch: arm64
            npm_config_arch: arm64
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
        env:
          npm_config_arch: ${{ matrix.npm_config_arch }}
      - shell: pwsh
        run: echo "target=${{ matrix.platform }}-${{ matrix.arch }}" >> $env:GITHUB_ENV
      - run: npx vsce package --target ${{ env.target }}
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ env.target }}
          path: "*.vsix"

  release:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - uses: actions/download-artifact@v3
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          # In case you want to publish to OpenVSX
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
```
