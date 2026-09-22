<p align="center">
    <img height="60px" width="60px" src="https://badgen.net/statics/badgen-logo.svg" />
    <h1 align="center">Badgen Service</h1>
</p>

<p align="center">
    <a href="https://stats.uptimerobot.com/z6nqBfYGB/780862024"><img src="https://badgen.net/uptime-robot/response/m780862024-50db2c44c703e5c68d6b1ebb" /></a>
    <a href="LICENSE.md"><img src="https://badgen.net/github/license/badgen/badgen.net" /></a>
    <a href="https://x.com/badgen_net"><img src="https://badgen.net/badge/twitter/@badgen_net/1DA1F2?icon&label" /></a>
    <a href="https://opencollective.com/badgen"><img src="https://badgen.net/badge/support/badgen/3988FB"/></a>
</p>

<p align="center">Home of <a href="https://badgen.net">badgen.net</a>, fast badge generating service.</p>

## The Badgen Story

> That's a service, that's a library, hooorey!  - [@tunnckoCore](https://github.com/badgen/badgen.net/pull/17)

> Finally something to replace http://shields.io - [@EGOIST](https://x.com/localhost_5173/status/1024202206185119744)

> Epic work on Badgen! Porting the @dependabot badges over to it now. ⚡️ - [@greybaker](https://x.com/greybaker/status/1023253585021333504)

The [badgen](https://github.com/badgen/badgen) library was born as an exploration of "is it possible to generate badge SVG markup directly (without using pdfkit/canvas/puppeteer to measure text width)?". The result is better than I expected, Width of Verdana (the de-facto font for badges) text can be calculated precisely with a prebuilt [char-width-table](https://github.com/badgen/badgen/blob/master/src/widths-verdana-110.json), even no need to worry about kerning 🤯

Then, logically, [Badgen Service](https://badgen.net) was born. I had a good time with [shields.io](https://shields.io), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative with simplicity and flexibility. Its codebase is simple (<b title="cloc . --exclude-dir node_modules --match-f '.js$'">2K LoCs</b> vs Shields' 22K LoCs), well structured and fun to develop - it is pretty easy to add badge(s) for new service(s).

In the beginning, I was considering both Vercel and Google Cloud Functions. Then Vercel announced Edge Network on the same day as badgen.now.sh (the PoC of Badgen Service)'s reveal, what a fate! Cloudflare powered Vercel Edge Network is a perfect choice for such service, caching and scalability in simplicity. Badgen is the fastest possible badge generating service out there. It's fast, it's reliable, it's globally distributed and cached, thanks to Vercel.

At the time of badgen.now.sh's reveal, it had only four live badges as demonstrations. Since then, thanks to [awesome people](https://github.com/badgen/badgen.net/graphs/contributors)'s help, Badgen keeps getting better at a fast pace. Welcome to join us, let's build the best badge service in the universe 🔥

## Anatomy

- Written in TypeScript
- Using [badgen](https://github.com/badgen/badgen) library to generate svg on the fly
- Two visual styles
    - https://badgen.net - classic style badges
    - https://flat.badgen.net - flat & square style badges
- Two badge types
    - static badge - URL defined badge (label, status, color)
    - live badge - Show live status from 3rd party services
- Builtin Icons & External Icon Support
    - Builtin icons: [badgen-icons](https://github.com/badgen/badgen-icons)
    - Brand icons: [simple-icons](https://simpleicons.org)
- Docker image [amio/badgen](https://hub.docker.com/r/amio/badgen)

## Developing

[![Contributors][contributors-src]][contributors-href]
[![Docker image][docker-src]][docker-href]

Use Node.js 24 (see `.nvmrc`) and npm 11 or newer. Install dependencies first:

    npm ci

**start dev server**

    npm run dev

**start prod server**

    npm run build && npm start

**run with docker image**

    docker run -p 3000:3000 amio/badgen

### Validation

Run lint and the local regression suite without external services:

    npm run lint
    npm test

Install `redis-server` and `redis-cli` to include the real Redis ownership and expiry tests. The suite starts and cleans up its own temporary Redis instance; no running Redis service or production KV credentials are needed. These tests are skipped when either tool is unavailable locally. PR CI installs both tools and runs lint, tests, and a production build.

For E2E smoke tests, start the server and specify its URL:

    BASE_URL=http://localhost:3000 npm run test:e2e

These tests include email badges and contact upstream services for live badges. Set `BASE_URL` to a deployment URL to check that deployment. The memo write test is skipped unless `MEMO_BADGE_TOKEN` is set; providing it updates the target's `deployed` badge. Deployment CI supplies its existing token for that check.

### Add Live Badge

If a service you wish to have is still missing here, we welcome new contributions. Take [/crates](https://badgen.net/crates) as an example:

1. Add a handler in `pages/api/[name-of-service].ts`, including its title, help, and examples. See [pages/api/crates.ts](pages/api/crates.ts).
2. Register the handler in [libs/badge-list2.ts](libs/badge-list2.ts), the index of live badges.
3. Add the public route to `badgeApis` in [next.config.js](next.config.js).
4. Add regression tests for the service's behavior, run `npm test`, and check the public badge and help URLs with `npm run dev`.

`npm run dev` and `npm run build` run `npm run generate` first. It generates `public/.meta/badge-list.json` and the public service reference at `/badges.md` from the registered handlers. The JSON metadata is ignored by Git; [public/badges.md](public/badges.md) is tracked as public documentation. After updating handler metadata, run `npm run generate` and commit the refreshed `public/badges.md` along with the source changes instead of editing generated files directly.

__NOTES__

- You can create live badge without touching badgen.net's code. Checkout docs for [/runkit](https://badgen.net/runkit) or [/https](https://badgen.net/https).

- The [/runkit](https://badgen.net/runkit) support would be super handy for prototyping a new live badge.

### Add Icon

You can contribute icons to [badgen-icons](https://github.com/badgen/badgen-icons). Please make sure new icon is optimized using [svgomg](https://jakearchibald.github.io/svgomg/).

## Tracking Policy

Badgen use [Sentry](https://sentry.io) to collect errors for improving service, use Google Analytics on doc pages ([home](https://badgen.net), [/github](https://badgen.net/github), [/packagephobia](https://badgen.net/packagephobia), etc.) to understand overall usage.

Badgen do not collect any identifying information.

## Environments

Supported environment variables for managing a Badgen instance.

- `GITHUB_TOKENS` - Comma delimited list of Github Tokens. Required for Github Badges.
- `GITHUB_API` - Custom Github API endpoint. e.g., `https://github.mycompany.com/api/v3`
- `GITHUB_API_GRAPHQL` - Custom Github GraphQL API endpoint. e.g., `https://github.mycompany.com/api/graphql`
- `NPM_REGISTRY` - Custom NPM registry endpoint.  Default: `https://registry.npmjs.org`
- `SENTRY_DSN` - Sentry Error Monitoring Data Source Name.
- `GA_MEASUREMENT_ID` - Google Analytics Measurement ID.
- `DOCKER_AUTHENTICATION_API` - Custom docker authentication endpoint. Default: `https://auth.docker.io/`
- `DOCKER_REGISTRY_API` - Custom docker registry endpoint. Default: `https://registry.hub.docker.com/`
- `GITLAB_TOKENS` - Comma delimited list of GitLab Tokens.
- `GITLAB_API_GRAPHQL` - GitLab GraphQL API endpoint. Default: `https://gitlab.com/api/graphql`
- `GITLAB_API` - GitLab REST API endpoint. Default: `https://gitlab.com/api/v4`
- `WAPM_API_GRAPHQL` - WAPM GraphQL API endpoint. Default: `https://registry.wapm.io/graphql`
- `BADGE_STYLE` - Use `flat` for the flat design.

## Contributors

Thanks to our [contributors][contributors-href] 🎉👏

[![](https://opencollective.com/badgen/contributors.svg?width=980&button=false)][contributors-href]

## Support Badgen

We are on OpenCollective https://opencollective.com/badgen

Support this project by donation, help Badgen continue and evolving!

[[Become a backer](https://opencollective.com/badgen#backer)]


## Sponsors

<a href="https://vercel.com"><img src="https://badgen-sponsors.now.sh/vercel.svg" height="200px" /></a>
<a href="https://sentry.io"><img src="https://badgen-sponsors.now.sh/sentry.svg" height="200px" /></a>

[contributors-src]: https://badgen.net/github/contributors/badgen/badgen.net
[contributors-href]: https://github.com/badgen/badgen.net/graphs/contributors
[docker-src]: https://badgen.net/badge/docker/amio%2Fbadgen?label&icon=docker
[docker-href]: https://hub.docker.com/r/amio/badgen
