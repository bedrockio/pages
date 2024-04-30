# @bedrockio/pages

Bedrock utilities for static site generation.

- [Install](#install)
- [Deployment](#deployment)
- [Monorepo](#monorepo)

## Install

```bash
yarn install @bedrockio/pages
```

## Deployment

### Cloudflare Pages

To deploy to Cloudflare Pages your project should use Yarn v3, otherwise the `sharp` binary in `favicons` may not deploy correctly.

## Monorepo

Installing a new dependency to a package in the monorepo involves two steps:

```bash
yarn workspace @bedrockio/pages add <package>
# Required to consolidate dependencies to root
yarn install
```
