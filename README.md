# @bedrockio/pages

Bedrock utilities for static site generation.

- [Install](#install)
- [Deployment](#deployment)
- [Monorepo](#monorepo)

## Install

```bash
yarn install @bedrockio/pages
```

> [!WARNING]
> When installing using Yarn v1 you may get errors due to the `sharp` binary not installing correctly. To fix this use:

```bash
yarn install @bedrockio/pages --ignore-engines
```

## Deployment

### Google Cloud

In GCP, deploying a new version requires the default service account to have the ability to patch deployments. This can be added by applying [the app-deployer role](api/deployer-role.yml) to your kubernetes cluster.

### Cloudflare Pages

To deploy to Cloudflare Pages your project should use Yarn v3, otherwise the `sharp` binary in `favicons` may not deploy correctly.

## Monorepo

Installing a new dependency to a package in the monorepo involves two steps:

```bash
yarn workspace @bedrockio/pages add <package>
# Required to consolidate dependencies to root
yarn install
```
