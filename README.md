# Badgen Service

[![StandardJS][standard-src]][standard-href]
[![dependencies][dep-src]][dep-href]
[![uptime past week][uptime-src]][uptime-href]
[![response time][response-src]][uptime-href]

Home of [Badgen](https://badgen.net), fast badge generating service.

## The Badgen Story

TLDR: Badgen Service is using [badgen](https://github.com/amio/badgen) to generate svg badges on the fly, running on Zeit's [now.sh](https://zeit.co/now), serving behind Now CDN.

> That's a service, that's a library, hooorey!  
> [@tunnckoCore](https://twitter.com/tunnckoCore)

The [badgen](https://github.com/amio/badgen) library was born as an exploration of "is it possible to generate badge svg markup directly with JavaScript(without using pdfkit/canvas/puppeteer to measure text length)?". Result is better than I expected, Verdana(the de-facto font for badges) text width can be calculated precisely with a prebuilt [char-width-table](https://github.com/amio/badgen/blob/master/lib/widths-verdana-11.json), even no need to worry about kerning 🤯

And so, Badge Service was born. I had a good time with [shields.io](https://shields.io)(and earlier [badge.fury.io](https://badge.fury.io)), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative with simplicity and flexibility. Its codebase is well structured and fun to develop - it is pretty easy to add badge(s) for new service(s).

At the beginning I was considering between [now.sh](https://zeit.co/now) and [Google Cloud Functions](https://cloud.google.com/functions/). Then Zeit released [Now CDN](https://zeit.co/blog/now-cdn) on the same day as [badgen.now.sh](https://badgen.now.sh)'s reveal, what a fate! Base such service on Zeit's Now CDN is the perfect choice, we can stop thinking about caching and scalability issues. Badgen is the fastest possible badge generating service out there. It's fast, it's amazing, it's globally distributed and cached, because of Now.

Thanks to awesome people's help, Badgen are getting better and better. Welcome to join us, let's build the best badge service in the universe 🔥

## Developing

We are using [StandardJS][standard-href] style, make sure you have ESLint/Standard plugin on your editor and have autofix enabled.

If a service you wish to have is still missing here, we welcome new contirbutions. Check out [live-fns/crates.js](libs/live-fns/crates.js) and [live-fns/_index.js](libs/live-fns/_index.js) to get a quick impression. Basically, you need to add a file in `libs/live-fns/[name-of-service].js` and that's it.

To ensure that your addition is working correctly start the development server with `npm run dev`.

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).

[standard-src]: https://badgen.net/badge/code%20style/standard/F2A
[standard-href]: https://standardjs.com/
[dep-src]: https://badgen.net/david/dep/amio/badgen-service
[dep-href]: https://david-dm.org/amio/badgen-service
[uptime-src]: https://badgen.net/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af?label=uptime%20past%20week
[response-src]: https://badgen.net/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af
[uptime-href]: https://stats.uptimerobot.com/z6nqBfYGB
