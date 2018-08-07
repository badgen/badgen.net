# Badgen Service

![License ISC](https://badgen.net/badge/license/ISC)
[![StandardJS][standard-src]][standard-href]
[![dependencies][dep-src]][dep-href]
[![uptime past week][uptime-src]][uptime-href]
[![response time][response-src]][uptime-href]
[![deploy to now][deploy-to-now]](#deploy-to-now-cloud)

Home of [badgen.net](https://badgen.net), fast badge generating service.

## Badgen is

- Written in latest, vanilla JavaScript => no build process
- Using [badgen](https://github.com/amio/badgen) library to generate svg on the fly => fast & stateless
- Hosted on [Now Cloud][now-href], serving behind Now CDN => faster & reliable
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

We are using [StandardJS][standard-href] style, make sure you have ESLint/Standard plugin on your editor and have autofix enabled.

### Add live badge

If a service you wish to have is still missing here, we welcome new contirbutions. Basically, you need to add a file in `libs/live-fns/[name-of-service].js` and that's it. Take [crates](https://badgen.net/#crates) as an example:

- [libs/live-fns/crates.js](libs/live-fns/crates.js) - the main function for [crates.io](https://crates.io)
- [libs/live-fns/_index.js](libs/live-fns/_index.js) - the index of live-badges
- [libs/index.md](libs/index.md) - the `index.md` holds examples

To ensure that your addition is working correctly start the development server with `npm run dev`.

### Add icon

Badgen Server will auto load all svg files in [libs/icons](libs/icons/). Please make sure new icon is optimized using [svgomg](https://jakearchibald.github.io/svgomg/).

### Deploy to Now Cloud

Badgen generate badges on the fly, which means it's stateless (not rely on any db service). Deploy your own Badgen Service to [Now Cloud](https://zeit.co/now) with one single command:
```
now amio/badgen-service -e GH_TOKEN=''
```

> `GH_TOKEN` is required by Now deployment, but it's optional for Badgen (mostly, except some github badges :P).

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).

[now-href]: https://zeit.co/now
[standard-src]: https://badgen.net/badge/code%20style/standard/F2A
[standard-href]: https://standardjs.com/
[dep-src]: https://badgen.net/david/dep/amio/badgen-service?label=deps
[dep-href]: https://david-dm.org/amio/badgen-service
[uptime-src]: https://badgen.net/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af
[response-src]: https://badgen.net/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af
[uptime-href]: https://stats.uptimerobot.com/z6nqBfYGB
[deploy-to-now]: https://badgen.net/badge/▲/$%20now%20amio%2Fbadgen-service/222
