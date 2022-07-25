# semantic-release-vsce

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to package and publish VS Code extensions.

[![npm](https://img.shields.io/npm/v/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![downloads](https://img.shields.io/npm/dt/semantic-release-vsce.svg)](https://www.npmjs.com/package/semantic-release-vsce)
[![ci](https://github.com/felipecrs/semantic-release-vsce/workflows/ci/badge.svg)](https://github.com/felipecrs/semantic-release-vsce/actions?query=workflow%3Aci)
[![dependencies](https://david-dm.org/felipecrs/semantic-release-vsce/status.svg)](https://david-dm.org/felipecrs/semantic-release-vsce)
[![peerDependencies](https://david-dm.org/felipecrs/semantic-release-vsce/peer-status.svg)](https://david-dm.org/felipecrs/semantic-release-vsce?type=peer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

| Step      | Description                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify`  | Verify the presence and the validity of the authentication (set via [environment variables](#environment-variables)) and the `package.json`                                                 |
| `prepare` | Generate the `.vsix` file using vsce, this can be be controlled by providing `packageVsix` in config. <br/> _Note: If the `OVSX_PAT` environment variable is set, this step will still run_ |
| `publish` | Publish the extension                                                                                                                                                                       |

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
            "path": "*.vsix",
            "label": "Extension File"
          }
        ]
      }
    ]
  ]
}
```

## Configuration

| Option        | Type                  | Description                                                                                                                        |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `packageVsix` | `boolean` or `string` | If set to `true`, the plugin will generate a `.vsix` file. If is a string, it will be used as value for `--out` of `vsce package`. |
| `publish`     | `boolean`             | The plugin will publish the package unless this option is set to `false`, in which case il will only package the extension.        |

### Environment Variables

| Variable   | Description                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `VSCE_PAT` | _**Required**_ unless `publish` is set to `false`. The personal access token to publish the extension of VS Code Marketplace |
| `OVSX_PAT` | _Optional_. The personal access token to push to OpenVSX                                                                     |

### Publishing to OpenVSX

Publishing extensions to OpenVSX using this plugin is easy:

1. Get a valid personal access token with the correct privileges to the publisher namespace in OpenVSX. In order to get the personal access token, check this [page](https://github.com/eclipse/openvsx/wiki).

2. Configure the `OVSX_PAT` environment variable in your CI with the token that you created.

3. The plugin will automatically detect the environment variable and it will publish to OpenVSX, no additional configuration is needed. Enjoy!

### Github Actions Example

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
      - name: Install Node Dependencies
        run: npm ci
      - name: Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
```
