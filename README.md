<p align="center">
    <img height="60px" width="60px" src="https://badgen.net/static/badgen-logo.svg" />
    <h1 align="center">Badgen Service</h1>
</p>

<p align="center">
    <a href="https://status.badgen.net/"><img src="https://badgen.net/uptime-robot/week/m780862024-50db2c44c703e5c68d6b1ebb?label=past%20week%20uptime" /></a>
    <a href="https://stats.uptimerobot.com/z6nqBfYGB/780862024"><img src="https://badgen.net/uptime-robot/response/m780862024-50db2c44c703e5c68d6b1ebb" /></a>
    <a href="LICENSE.md"><img src="https://badgen.net/github/license/amio/badgen-service" /></a>
    <a href="https://twitter.com/badgen_net"><img src="https://badgen.net/badge//@badgen_net/1DA1F2?icon=twitter" /></a>
    <a href="#backers"><img src="https://opencollective.com/badgen/backers/badge.svg"/></a>
 	<a href="#sponsors"><img src="https://opencollective.com/badgen/sponsors/badge.svg"/></a> 
</p>

<p align="center">Home of <a href="https://badgen.net">badgen.net</a>, fast badge generating service.</p>

## The Badgen Story

> That's a service, that's a library, hooorey!  - [@tunnckoCore](https://github.com/amio/badgen-service/pull/17)

> Finally something to replace http://shields.io - [@EGOIST](https://twitter.com/_egoistlily/status/1024202206185119744)

> Epic work on Badgen! Porting the @dependabot badges over to it now. ⚡️ - [@greybaker](https://twitter.com/greybaker/status/1023253585021333504)

The [badgen](https://github.com/amio/badgen) library was born as an exploration of "is it possible to generate badge SVG markup directly with JavaScript (without using pdfkit/canvas/puppeteer to measure text length)?". The result is better than I expected, Verdana (the de-facto font for badges) text width can be calculated precisely with a prebuilt [char-width-table](https://github.com/amio/badgen/blob/master/lib/widths-verdana-110.json), even no need to worry about kerning 🤯

Then, logically, [Badgen Service](https://badgen.net) was born. I had a good time with [shields.io](https://shields.io), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative with simplicity and flexibility. Its codebase is simple (<b title="cloc . --exclude-dir node_modules --match-f '.js$'">2K LoCs</b> vs Shields' 22K LoCs), well structured and fun to develop - it is pretty easy to add badge(s) for new service(s).

In the beginning, I was considering both [Now](https://zeit.co/now) and [Google Cloud Functions](https://cloud.google.com/functions/). Then Zeit announced [Now CDN](https://zeit.co/blog/now-cdn) on the same day as badgen.now.sh (the PoC of Badgen Service)'s reveal, what a fate! Cloudflare powered Now CDN is a perfect choice for such service, caching and scalability in simplicity. Badgen is the fastest possible badge generating service out there. It's fast, it's reliable, it's globally distributed and cached, thanks to Now.

At the time of badgen.now.sh's reveal, it had only four live badges as demonstrations. Since then, thanks to [awesome people](https://github.com/amio/badgen-service/graphs/contributors)'s help, Badgen keeps getting better at a fast pace. Welcome to join us, let's build the best badge service in the universe 🔥

## Anatomy

- Written in TypeScript => better develop experience
- Using [badgen](https://github.com/amio/badgen) library to generate svg on the fly => fast & stateless
- Hosted on [Now][now-href], serving behind Now CDN => faster & reliable
- Cache less than 4 minutes => fresh & hot
- Two styles:
    - https://badgen.net - classic style badges
    - https://flat.badgen.net - flat & square style badges
- Two badge types
    - static badge - URL defined badge (subject, status, color)
    - live badge - show live status from 3rd party services
- Builtin Icons
    - see [badgen-icons](https://github.com/badgen/badgen-icons)

## Developing

[![Contributors][contributors-src]][contributors-href]
[![StandardJS][standard-src]][standard-href]
[![Dependencies][dependencies-src]][dependencies-href]
[![Maintainability][maintainability-src]][maintainability-href]
[![Code Quality][codequality-src]][codequality-href]
[![LGTM Alerts][alerts-src]][alerts-href]

We are using [StandardJS][standard-href] style, make sure you have ESLint/Standard plugin on your editor and have autofix enabled.

### Add live badge

If a service you wish to have is still missing here, we welcome new contributions. Basically, you need to add a file in `endpoints/[name-of-service].ts` and that's it. Take [crates](https://badgen.net/#crates) as an example:

- [endpoints/crates.ts](endpoints/crates.ts) - main function for [crates](https://badgen.net/docs/crates) badges
- [libs/badge-list.ts](libs/badge-list.ts) - contains index of all live badges

To ensure that your addition is working correctly, start the development server with `npm run dev`.

> YOU MAY NOT NEED TO MAKE PULL REQUEST
>
> You can create arbitrary live badge with RunKit's online IDE, or any https endpoint. Checkout docs: [/runkit](https://badgen.net/docs/runkit) or [/https](https://badgen.net/docs/https).

### Add icon

You can contribute icons to [badgen-icons](https://github.com/badgen/badgen-icons). Please make sure new icon is optimized using [svgomg](https://jakearchibald.github.io/svgomg/).

## Tracking Policy

Badgen use Google Analytics on doc pages ([home](https://badgen.net), [/docs/packagephobia](https://badgen.net/docs/packagephobia), etc.), log request time to 3rd party service for live badges, like:
```
2018-08-09T04:16:30.947Z  #npm dt/chalk: 160.519ms
2018-08-09T04:16:31.195Z  #npm dependents/chalk: 365.045ms
2018-08-09T04:16:51.252Z  #david dep/olstenlarck/eslint-config-esmc: 445.893ms
```

And that's all. No tracking of end users.

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).

[dependencies-src]: https://badgen.net/david/dep/amio/badgen-service?label=deps
[dependencies-href]: https://david-dm.org/amio/badgen-service
[standard-src]: https://badgen.net/badge/code%20style/standard/pink
[standard-href]: https://standardjs.com
[maintainability-src]: https://badgen.net/codeclimate/maintainability/amio/badgen-service
[maintainability-href]: https://codeclimate.com/github/amio/badgen-service
[codequality-src]: https://badgen.net/lgtm/grade/javascript/g/amio/badgen-service
[codequality-href]: https://lgtm.com/projects/g/amio/badgen-service/context:javascript
[alerts-src]: https://badgen.net/lgtm/alerts/g/amio/badgen-service
[alerts-href]: https://lgtm.com/projects/g/amio/badgen-service/alerts/
[contributors-src]: https://badgen.net/github/contributors/amio/badgen-service
[contributors-href]: https://github.com/amio/badgen-service/graphs/contributors
[now-href]: https://zeit.co/now

## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/amio/badgen-service/graphs/contributors"><img src="https://opencollective.com/badgen/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/badgen#backer)]

<a href="https://opencollective.com/badgen#backers" target="_blank"><img src="https://opencollective.com/badgen/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/badgen#sponsor)]

<a href="https://opencollective.com/badgen/sponsor/0/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/1/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/2/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/3/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/4/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/5/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/6/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/7/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/8/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/badgen/sponsor/9/website" target="_blank"><img src="https://opencollective.com/badgen/sponsor/9/avatar.svg"></a>


