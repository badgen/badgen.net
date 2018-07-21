# Badgen Service

![dependencies](https://badgen.now.sh/david/dep/amio/badgen-service)
![service status](https://badgen.now.sh/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af)
![uptime last week](https://badgen.now.sh/uptime-robot/week/m780731617-a9e038618dc1aee36a44c4af)
![response time](https://badgen.now.sh/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af)

Home of [Badgen](https://badgen.now.sh), fast badge generating service.

## The Badgen Story

> That's a service, that's a library, hooorey! -- [@tunnckoCore](https://twitter.com/tunnckoCore)

TLDR: Badgen Service is using [badgen](https://github.com/amio/badgen) to generate svg badges on the fly, running on Zeit's [now.sh](https://zeit.co/now), serving behind Now CDN.

The [badgen](https://github.com/amio/badgen) library was born as an exploration of "is it possible to generate badge svg markup directly with JavaScript(without using pdfkit/canvas/puppeteer to measure text length)?". Result is better than I expected, Verdana(the de-facto font for badges) text width can be calculated precisely with a prebuilt [char-width-table](https://github.com/amio/badgen/blob/master/lib/widths-verdana-11.json), even no need to worry about kerning 🤯

And so, Badge Service was born. I had a good time with [shields.io](https://shields.io)(and earlier [badge.fury.io](https://badge.fury.io)), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative with simplicity and flexibility. Its codebase is well structured and fun to develop - it is pretty easy to add badge(s) for new service(s). 

At the beginning I was considering between [now.sh](https://zeit.co/now) and [Google Cloud Functions](https://cloud.google.com/functions/). Then Zeit released [Now CDN](https://zeit.co/blog/now-cdn) on the same day as [badgen.now.sh](https://badgen.now.sh)'s reveal, what a fate! Born to fall in love 😘. Choosing to base such service on Zeit's Now CDN is the perfect choice, because we can stop thinking about caching and scalability issues. Badgen is the fastest possible badge generating service out there. It's fast, because Now is fast. It's amazing, because Now is amazing. It's globally distributed and cached, because of Now.

Thanks to awesome people's help, Badgen are getting better and better. Welcome to join us, let's build the best badge service in the universe 🔥

## Developing

We are using StandardJS style, so don't worry. If you have ESLint plugin on your editor and have autofix enabled, then great - you write code and it's valid. Otherwise, installing ESLint plugin for your favorite editor is highly recommended, because it will help you not only here, but with contributions to other projects too.

If a service you are using is still missing here, we welcome new contirbutions. Check out the PRs that was made and how easy it was:

- [#3 - Support for Chrome Web Store badges](https://github.com/amio/badgen-service/pull/3)
- [#15 - Support for GitHub badges](https://github.com/amio/badgen-service/pull/15)
- [#16 - Support for CodeCov coverage badge](https://github.com/amio/badgen-service/pull/16)

Basically, you need to add a file in `lib/live-fns/[name-of-service].js` and that's it. 

To ensure that your addition is working correctly start the development server with `npm run dev`.

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).
