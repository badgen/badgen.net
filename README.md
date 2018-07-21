# Badgen Service

![dependencies](https://badgen.now.sh/david/dep/amio/badgen-service)
![service status](https://badgen.now.sh/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af)
![uptime last week](https://badgen.now.sh/uptime-robot/week/m780731617-a9e038618dc1aee36a44c4af)
![response time](https://badgen.now.sh/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af)

Fast badge generating service.

## Usage

Please head over to https://badgen.now.sh

## The Badgen Story

> That's a service, that's a library, hooorey! -- @olstenlarck

TLDR: [Badgen](https://badgen.now.sh) use [badgen](https://github.com/amio/badgen) to generate svg badges on the fly, running on Zeit's [now.sh](https://zeit.co/now), serving behind Now CDN.

The [badgen](https://github.com/amio/badgen) library was born as an exploration of "is it possible to generate badge svg markup directly with JavaScript(without using pdfkit/canvas/puppeteer to measure text length)?". Result is better than I expected, Verdana(the de-facto font for badges) text width can be calculated precisely with a prebuilt [char-width-table](https://github.com/amio/badgen/blob/master/lib/widths-verdana-11.json), even no need to worried about kerning 🤯

Then cames [Badgen](https://badgen.now.sh). I had a good time with [shields.io](https://shields.io)(and earlier [badge.fury.io](https://badge.fury.io)), but as time goes by Shields gets slower, leaves more and more broken badges in READMEs. Badgen is trying to be a fast alternative, offers extensibility with simplicity and flexibility.

At beginning I was considering between [now.sh](https://zeit.co/now) and [Google Cloud Functions](https://cloud.google.com/functions/). Then Zeit released [Now CDN](https://zeit.co/blog/now-cdn) on the same day as [badgen.now.sh](https://badgen.now.sh)'s reveal, what a fate! Born to fall in love ❤️. With Now CDN, Badgen removed all builtin cache while serving faster than ever. Now Badgen has settled it's home on Zeit's Now.

Thanks to awesome people's help, Badgen are getting better and better. Welcome to join us, let's build the best badge service in the universe 🔥

## Developing

- `npm start` or better if you have nodemon: `nodemon service.js`

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).
