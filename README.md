<p align="center">
    <img height="60px" width="60px" src="https://badgen.net/statics/badgen-logo.svg" />
    <h1 align="center">Badgen Service</h1>
</p>

<p align="center">
    <a href="https://status.badgen.net/"><img src="https://badgen.net/uptime-robot/week/m780862024-50db2c44c703e5c68d6b1ebb?label=past%20week%20uptime" /></a>
    <a href="https://stats.uptimerobot.com/z6nqBfYGB/780862024"><img src="https://badgen.net/uptime-robot/response/m780862024-50db2c44c703e5c68d6b1ebb" /></a>
    <a href="LICENSE.md"><img src="https://badgen.net/github/license/amio/badgen-service" /></a>
    <a href="https://twitter.com/badgen_net"><img src="https://badgen.net/badge/twitter/@badgen_net/1DA1F2?icon&label" /></a>
    <a href="https://opencollective.com/badgen"><img src="https://badgen.net/badge/support/badgen/3988FB"/></a>
</p>

<p align="center">Home of <a href="https://badgen.net">badgen.net</a>, fast badge generating service.</p>

## The Badgen Story

> That's a service, that's a library, hooorey!  - [@tunnckoCore](https://github.com/amio/badgen-service/pull/17)

> Finally something to replace http://shields.io - [@EGOIST](https://twitter.com/_egoistlily/status/1024202206185119744)

> Epic work on Badgen! Porting the @dependabot badges over to it now. ⚡️ - [@greybaker](https://twitter.com/greybaker/status/1023253585021333504)

The [badgen](https://github.com/amio/badgen) library was born as an exploration of "is it possible to generate badge SVG markup directly (without using pdfkit/canvas/puppeteer to measure text width)?". The result is better than I expected, Width of Verdana (the de-facto font for badges) text can be calculated precisely with a prebuilt [char-width-table](https://github.com/badgen/badgen/blob/master/src/widths-verdana-110.json), even no need to worry about kerning 🤯

Then, logically, [Badgen Service](https://badgen.net) was born. I had a good time with [shields.io](https://shields.io), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative with simplicity and flexibility. Its codebase is simple (<b title="cloc . --exclude-dir node_modules --match-f '.js$'">2K LoCs</b> vs Shields' 22K LoCs), well structured and fun to develop - it is pretty easy to add badge(s) for new service(s).

In the beginning, I was considering both [Vercel](https://vercel.com/) and [Google Cloud Functions](https://cloud.google.com/functions/). Then Vercel announced [Edge Network](https://vercel.com/edge-network) on the same day as badgen.now.sh (the PoC of Badgen Service)'s reveal, what a fate! Cloudflare powered Vercel Edge Network is a perfect choice for such service, caching and scalability in simplicity. Badgen is the fastest possible badge generating service out there. It's fast, it's reliable, it's globally distributed and cached, thanks to Vercel.

At the time of badgen.now.sh's reveal, it had only four live badges as demonstrations. Since then, thanks to [awesome people](https://github.com/amio/badgen-service/graphs/contributors)'s help, Badgen keeps getting better at a fast pace. Welcome to join us, let's build the best badge service in the universe 🔥

## Anatomy

- Written in TypeScript
- Using [badgen](https://github.com/amio/badgen) library to generate svg on the fly
- Two visual styles
    - https://badgen.net - classic style badges
    - https://flat.badgen.net - flat & square style badges
- Two badge types
    - static badge - URL defined badge (label, status, color)
    - live badge - Show live status from 3rd party services
- Builtin Icons & External Icon Support
    - see [badgen-icons](https://github.com/badgen/badgen-icons)
- Docker image [amio/badgen](https://hub.docker.com/r/amio/badgen)

## Developing

[![Contributors][contributors-src]][contributors-href]
[![Maintainability][maintainability-src]][maintainability-href]
[![Docker image][docker-src]][docker-href]

**start dev server**

    npm run dev

**start prod server**

    npm run build && npm start

**run with docker image**

    docker run -p 3000:3000 amio/badgen

### Add Live Badge

If a service you wish to have is still missing here, we welcome new contributions. Basically, you need to add a file in `api/[name-of-service].ts` and that's it. Take [/crates](https://badgen.net/crates) as an example:

- [pages/api/crates.ts](pages/api/crates.ts) - main function for [crates](https://badgen.net/docs/crates) badges
- [libs/badge-list2.ts](libs/badge-list2.ts) - contains index of all live badges

To ensure that your addition is working correctly, start the development server with `npm run dev`.

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

- `GITHUB_TOKENS` - Comma delimited list of Github Tokens. Required for Github Badges
- `GITHUB_API` - Custom Github API endpoint. e.g., `https://github.mycompany.com/api/v3`
- `GITHUB_API_GRAPHQL` - Custom Github GraphQL API endpoint. e.g., `https://github.mycompany.com/api/graphql`
- `NPM_REGISTRY` - Custom NPM registry endpoint
- `SENTRY_DSN` - Sentry Error Monitoring Data Source Name
- `GA_MEASUREMENT_ID` - Google Analytics Measurement ID

## Contributors

Thanks to our [contributors][contributors-href] 🎉👏

[![](https://opencollective.com/badgen/contributors.svg?width=980&button=false)][contributors-href]

## Support Badgen

We are on OpenCollective https://opencollective.com/badgen

Support this project by donation, help Badgen continue and evolving!

[[Become a backer](https://opencollective.com/badgen#backer)]


## Sponsors

<a href="https://vercel.com"><img src="https://badgen-sponsors.now.sh/vercel.svg" height="220px" /></a>
<a href="https://sentry.io"><img src="https://badgen-sponsors.now.sh/sentry.svg" height="220px" /></a>

[maintainability-src]: https://badgen.net/codeclimate/maintainability/badgen/badgen.net
[maintainability-href]: https://codeclimate.com/github/badgen/badgen.net
[contributors-src]: https://badgen.net/github/contributors/badgen/badgen.net
[contributors-href]: https://github.com/badgen/badgen.net/graphs/contributors
[docker-src]: https://badgen.net/badge/docker/amio%2Fbadgen?label&icon=docker
[docker-href]: https://hub.docker.com/r/amio/badgen
