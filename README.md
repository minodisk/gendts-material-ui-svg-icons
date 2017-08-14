# gendts-material-ui-svg-icons

Types generator for svg-icons module of material-ui in DefinitelyTyped.

## How to execute

```sh
npm install -g gendts-material-ui-svg-icons
cd path/to/DefinitelyTyped/types/material-ui
gendts-material-ui-svg-icons
```

## GitHub API Limitation

When `gendts-material-ui-svg-icons` prints `GitHub response: 401 Unauthorized`, failed [Rate Limiting | GitHub API v3 \| GitHub Developer Guide](https://developer.github.com/v3/#rate-limiting). To avoid this case, publish [Personal access token](https://github.com/settings/tokens) and specify it like:

```sh
GITHUB_ACCESS_TOKEN=XXXXX gendts-material-ui-svg-icons
```
