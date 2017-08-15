# gendts-material-ui-svg-icons

Types generator for svg-icons module of material-ui in [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped).

## How to execute

```sh
npm install -g gendts-material-ui-svg-icons
cd path/to/DefinitelyTyped/types/material-ui
gendts-material-ui-svg-icons
```

## GitHub API Limitation

The error `GitHub response: 401 Unauthorized` is due to [Rate Limiting | GitHub API v3 \| GitHub Developer Guide](https://developer.github.com/v3/#rate-limiting). In order to avoid this, it is necessary to publish [Personal access token](https://github.com/settings/tokens) and specify it as an environment variable.

```sh
GITHUB_ACCESS_TOKEN=XXXXX gendts-material-ui-svg-icons
```
