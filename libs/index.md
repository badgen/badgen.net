# Badgen

Fast badge generating service.  
[![classic](https://badgen.net/badge/style/classic/pink)](https://badgen.net)
[![flat](https://flat.badgen.net/badge/style/flat/pink)](https://flat.badgen.net)

## Usage

```
https://badgen.net/badge/:subject/:status/:color
                   ──┬──  ───┬───  ──┬───  ──┬──
                     │       │       │       └─ RGB / Color Name
                     │      TEXT    TEXT       ( optional )
                     │
                  "badge" - default(static) badge generator
```

Available color names:

![](/badge/color/blue/blue)
![](/badge/color/cyan/cyan)
![](/badge/color/green/green)
![](/badge/color/yellow/yellow)
![](/badge/color/orange/orange)
![](/badge/color/red/red)
![](/badge/color/pink/pink)
![](/badge/color/purple/purple)
![](/badge/color/grey/grey)

## Examples

#### Static Badge

| Preview | URL |
| --- | --- |
|![](/badge/chat/gitter/purple) | [/badge/chat/gitter/purple](/badge/chat/gitter/purple)
|![](/badge/style/standard/f2a) | [/badge/style/standard/f2a](/badge/style/standard/f2a)
|![](/badge/stars/★★★★☆) | [/badge/stars/★★★★☆](/badge/stars/★★★★☆)
|![](/badge/license/Apache-2.0/blue) | [/badge/license/Apache-2.0/blue](/badge/license/Apache-2.0/blue)
|![](/badge/Language/Swift%203.0.1/orange) | [/badge/Language/Swift%203.0.1/orange](/badge/Language/Swift%203.0.1/orange)
|![](/badge/platform/ios,macos,tvos?list=1) | [/badge/platform/ios,macos,tvos?list=1](/badge/platform/ios,macos,tvos?list=1)

#### Live Badge

| Keyword | Preview | URL |
| --- | --- | --- |
| github release | ![](/github/release/babel/babel) | [/github/release/babel/babel](/github/release/babel/babel)
| github tag | ![](/github/tag/micromatch/micromatch) | [/github/tag/micromatch/micromatch](/github/tag/micromatch/micromatch)
| npm version | ![](/npm/v/express) | [/npm/v/express](/npm/v/express)
| npm version | ![](/npm/v/marked) | [/npm/v/marked](/npm/v/marked)
| npm version (scoped) | ![](/npm/v/@nestjs/core) | [/npm/v/@nestjs/core](/npm/v/@nestjs/core)
| npm downloads/day | ![](/npm/dd/micromatch) | [/npm/dd/micromatch](/npm/dd/micromatch)
| npm downloads/week | ![](/npm/dw/express) | [/npm/dw/express](/npm/dw/express)
| npm downloads/month | ![](/npm/dm/express) | [/npm/dm/express](/npm/dm/express)
| npm downloads/year | ![](/npm/dy/express) | [/npm/dy/express](/npm/dy/express)
| npm downloads/total | ![](/npm/dt/micromatch) | [/npm/dt/express](/npm/dt/micromatch)
| npm license | ![](/npm/license/lodash) | [/npm/license/lodash](/npm/license/lodash)
| npm engines (node)  | ![](/npm/node/express) | [/npm/node/express](/npm/node/express)
| crates.io version | ![](/crates/v/regex) | [/crates/v/regex](/crates/v/regex)
| crates.io downloads | ![](/crates/d/regex) | [/crates/d/regex](/crates/d/regex)
| crates.io downloads/latest | ![](/crates/dl/regex) | [/crates/dl/regex](/crates/dl/regex)
| chrome extension version | ![](/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension users | ![](/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension price | ![](/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension rating | ![](/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension stars | ![](/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension rating count | ![](/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| mozilla add-on version | ![](/amo/v/markdown-viewer-chrome) | [/amo/v/markdown-viewer-chrome](/amo/v/markdown-viewer-chrome)
| mozilla add-on users | ![](/amo/users/markdown-viewer-chrome) | [/amo/users/markdown-viewer-chrome](/amo/users/markdown-viewer-chrome)
| mozilla add-on rating | ![](/amo/rating/markdown-viewer-chrome) | [/amo/rating/markdown-viewer-chrome](/amo/rating/markdown-viewer-chrome)
| mozilla add-on stars | ![](/amo/stars/markdown-viewer-chrome) | [/amo/stars/markdown-viewer-chrome](/amo/stars/markdown-viewer-chrome)
| mozilla add-on reviews | ![](/amo/reviews/markdown-viewer-chrome) | [/amo/reviews/markdown-viewer-chrome](/amo/reviews/markdown-viewer-chrome)
| homebrew version | ![](/homebrew/v/fish) | [/homebrew/v/fish](/homebrew/v/fish)
| homebrew version | ![](/homebrew/v/cake) | [/homebrew/v/cake](/homebrew/v/cake)
| travis | ![](/travis/amio/micro-cors) | [/travis/amio/micro-cors](/travis/amio/micro-cors)
| travis (branch) | ![](/travis/babel/babel/6.x) | [/travis/babel/babel/6.x](/travis/babel/babel/6.x)
| codecov | ![](/codecov/c/github/tunnckoCore/gitcommit) | [/codecov/c/github/tunnckoCore/gitcommit](/codecov/c/github/tunnckoCore/gitcommit)
| codecov (branch) | ![](/codecov/c/github/babel/babel/6.x) | [/codecov/c/github/babel/babel/6.x](/codecov/c/github/babel/babel/6.x)
| circleci | ![](/circleci/github/amio/now-go) | [/circleci/github/amio/now-go](/circleci/github/amio/now-go)
| circleci (branch) | ![](/circleci/github/amio/now-go/master) | [/circleci/github/amio/now-go/master](/circleci/github/amio/now-go/master)
| appveyor ci | ![](/appveyor/ci/gruntjs/grunt) | [/appveyor/ci/gruntjs/grunt](/appveyor/ci/gruntjs/grunt)
| david-dm | ![](/david/dep/zeit/pkg) | [/david/dep/zeit/pkg](/david/dep/zeit/pkg)
| david-dm dev dependencies | ![](/david/dev/zeit/pkg) | [/david/dev/zeit/pkg](/david/dev/zeit/pkg)
| david-dm peer dependencies | ![](/david/peer/epoberezkin/ajv-keywords) | [/david/peer/epoberezkin/ajv-keywords](/david/peer/epoberezkin/ajv-keywords)
| david-dm optional dependencies | ![](/david/optional/epoberezkin/ajv-keywords) | [/david/optional/epoberezkin/ajv-keywords](/david/optional/epoberezkin/ajv-keywords)
| docker pulls (library) | ![](/docker/pulls/library/ubuntu) | [/docker/pulls/library/ubuntu](/docker/pulls/library/ubuntu)
| docker stars (library) | ![](/docker/stars/library/ubuntu) | [/docker/stars/library/ubuntu](/docker/stars/library/ubuntu)
| docker pulls (scoped) | ![](/docker/pulls/amio/node-chrome) | [/docker/pulls/amio/node-chrome](/docker/pulls/amio/node-chrome)
| docker stars (icon & label) | ![](/docker/stars/library/mongo?icon=docker&label=stars) | [/docker/stars/library/mongo?icon=docker&label=stars](/docker/stars/library/mongo?icon=docker&label=stars)
| packagephobia publish size | ![](/packagephobia/publish/webpack) | [/packagephobia/publish/webpack](/packagephobia/publish/webpack)
| packagephobia install size | ![](/packagephobia/install/webpack) | [/packagephobia/install/webpack](/packagephobia/install/webpack)
| uptime robot status | ![](/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af) | [/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af](/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af)
| uptime robot uptime (day) | ![](/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af) | [/uptime-robot/lasy-day/m780731617-a9e038618dc1aee36a44c4af](/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af)
| uptime robot uptime (week) | ![](/uptime-robot/week/m780731617-a9e038618dc1aee36a44c4af) | [/uptime-robot/lasy-week/m780731617-a9e038618dc1aee36a44c4af](/uptime-robot/week/m780731617-a9e038618dc1aee36a44c4af)
| uptime robot uptime (month) | ![](/uptime-robot/month/m780731617-a9e038618dc1aee36a44c4af) | [/uptime-robot/lasy-month/m780731617-a9e038618dc1aee36a44c4af](/uptime-robot/month/m780731617-a9e038618dc1aee36a44c4af)
| uptime robot response (last hour) | ![](/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af) | [/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af](/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af)

## Query params

- `label`: Override default subject text ([URL-Encoding][url-enc-href] needed for spaces or special characters)
- `emoji`: If subject/status text contains emoji, `emoji=1` will make it happy 👻
- `style`: Force flat style with `style=flat`. [e.g.][style-eg-href]
- `list`: `list=1` will replace `,` with ` | ` in status text. [e.g.][list-eg-href]

## About

Made with ❤️ by [Amio](https://github.com/amio)
<span style="float:right; color: #AAA">
  <a href="https://twitter.com/badgen_net">twitter</a> |
  <a href="https://github.com/amio/badgen-service">github</a>
</span>

[url-enc-href]: https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding
[list-eg-href]: /badge/platform/ios,macos,tvos?list=1
[style-eg-href]: /badge/color/blue/blue?style=flat
