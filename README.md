<p align="center">
    <img height="60px" width="60px" src="https://badgen.net/static/badgen-logo.svg" />
    <h1 align="center">Badgen Service</h1>
</p>

<p align="center">
    <a href="https://stats.uptimerobot.com/z6nqBfYGB"><img src="https://badgen.net/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af?label=past%20week%20uptime" /></a>
    <a href="https://stats.uptimerobot.com/z6nqBfYGB/780862024"><img src="https://badgen.net/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af" /></a>
    <a href="LICENSE.md"><img src="https://badgen.net/github/license/amio/badgen-service" /></a>
    <a href="https://twitter.com/badgen_net"><img src="https://badgen.net/badge//@badgen_net/1DA1F2?icon=twitter" /></a>
</p>

<p align="center">Home of <a href="https://badgen.net">badgen.net</a>, fast badge generating service.</p>

## The Badgen Story

> That's a service, that's a library, hooorey!  - [@tunnckoCore](https://github.com/amio/badgen-service/pull/17)

> Finally something to replace http://shields.io - [@EGOIST](https://twitter.com/_egoistlily/status/1024202206185119744)

> Epic work on Badgen! Porting the @dependabot badges over to it now. ⚡️ - [@greybaker](https://twitter.com/greybaker/status/1023253585021333504)

The [badgen](https://github.com/amio/badgen) library was born as an exploration of "is it possible to generate badge svg markup directly with JavaScript (without using pdfkit/canvas/puppeteer to measure text length)?". Result is better than I expected, Verdana (the de-facto font for badges) text width can be calculated precisely with a prebuilt [char-width-table](https://github.com/amio/badgen/blob/master/lib/widths-verdana-11.json), even no need to worry about kerning 🤯

Then, logically, [Badgen Service](https://badgen.net) was born. I had a good time with [shields.io](https://shields.io), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative with simplicity and flexibility. Its codebase is simple (<b title="cloc . --exclude-dir node_modules --match-f '.js$'">2K LoCs</b> vs Shields' 22K LoCs), well structured and fun to develop - it is pretty easy to add badge(s) for new service(s).

At the beginning I was considering between [Now](https://zeit.co/now) and [Google Cloud Functions](https://cloud.google.com/functions/). Then Zeit announced [Now CDN](https://zeit.co/blog/now-cdn) on the same day as badgen.now.sh (the PoC of Badgen Service)'s reveal, what a fate! Cloudflare powered Now CDN is a perfect choice for such service, caching and scalability in simplicity. Badgen is the fastest possible badge generating service out there. It's fast, it's reliable, it's globally distributed and cached, thanks to Now.

At the time of badgen.now.sh's reveal, it had only four live badges as demonstration. Since then, thanks to [awesome people](https://github.com/amio/badgen-service/graphs/contributors)'s help, Badgen keeps getting better at a fast pace. Welcome to join us, let's build the best badge service in the universe 🔥

## Anatomy

- Written in latest, vanilla JavaScript => no build process
- Using [badgen](https://github.com/amio/badgen) library to generate svg on the fly => fast & stateless
- Hosted on [Now][now-href], serving behind Now CDN => faster & reliable
- Cache less than 4 minutes => fresh & hot
- Three endpoints in one server
    - https://badgen.net - classic style badges
    - https://flat.badgen.net - flat & square style badges
    - https://api.badgen.net - json “style” badges data (live badges only)
- Two badge types
    - static badge - url defined badge (subject, status, color)
    - live badge - show live status from 3rd party services
- Builtin Icons
    - Every icon is optimized with svgomg & reviewed by human eyes before it’s available online.

## Developing

[![StandardJS][standard-src]][standard-href]
[![Dependencies][dependencies-src]][dependencies-href]
[![Maintainability][maintainability-src]][maintainability-href]
[![Contributors][contributors-src]][contributors-href]
[![Deploy to Now][deploy-to-now-src]](#deploy-to-now)

We are using [StandardJS][standard-href] style, make sure you have ESLint/Standard plugin on your editor and have autofix enabled.

### Add live badge

If a service you wish to have is still missing here, we welcome new contirbutions. Basically, you need to add a file in `libs/live-fns/[name-of-service].js` and that's it. Take [crates](https://badgen.net/#crates) as an example:

- [libs/live-fns/crates.js](libs/live-fns/crates.js) - main function for [crates](https://badgen.net/#crates)
- [libs/live-fns/_index.js](libs/live-fns/_index.js) - index of all live-badges
- [libs/index.md](libs/index.md) - the `index.md` holds examples

To ensure that your addition is working correctly start the development server with `npm run dev`.

### Add icon

Badgen Server will auto load all svg files in [libs/icons](libs/icons/). Please make sure new icon is optimized using [svgomg](https://jakearchibald.github.io/svgomg/).

### Deploy to Now

Badgen is stateless (not rely on db service). Deploy your own instance to [Now][now-href] with one single command:
```
now amio/badgen-service
```

## Tracking Policy

Badgen use Google Analytics on doc pages ([home](https://badgen.net), [/docs/packagephobia](https://badgen.net/packagephobia), etc.), log request time to 3rd party service for live badges, like:
```
2018-08-09T04:16:30.947Z  #npm dt/chalk: 160.519ms
2018-08-09T04:16:31.195Z  #npm dependents/chalk: 365.045ms
2018-08-09T04:16:51.252Z  #david dep/olstenlarck/eslint-config-esmc: 445.893ms
```

And that's all. No tracking for end usage.

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).

[uptime-src]: https://badgen.net/uptime-robot/day/m780862024-50db2c44c703e5c68d6b1ebb?label=past%20week%20uptime
[uptime-href]: https://stats.uptimerobot.com/z6nqBfYGB
[response-src]: https://badgen.net/uptime-robot/response/m780862024-50db2c44c703e5c68d6b1ebb
[response-href]: https://stats.uptimerobot.com/z6nqBfYGB/780862024
[dependencies-src]: https://badgen.net/david/dep/amio/badgen-service
[dependencies-href]: https://david-dm.org/amio/badgen-service
[license-src]: https://badgen.net/github/license/amio/badgen-service
[license-href]: LICENSE.md
[standard-src]: https://badgen.net/badge/code%20style/standard/pink
[standard-href]: https://standardjs.com
[deploy-to-now-src]: https://badgen.net/badge/▲/$%20now%20amio%2Fbadgen-service/333
[maintainability-src]: https://badgen.net/codeclimate/maintainability/amio/badgen-service
[maintainability-href]: https://codeclimate.com/github/amio/badgen-service
[contributors-src]: https://badgen.net/github/contributors/amio/badgen-service
[contributors-href]: https://github.com/amio/badgen-service/graphs/contributors
[now-href]: https://zeit.co/now
