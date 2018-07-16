# Badgen

Fast badge generating service. Built with [badgen](https://github.com/amio/badgen).

## Usage

```
https://badgen.now.sh/badge/:subject/:status/:color
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
|![](/list/platform/ios,macos,tvos/37E) | [/list/platform/ios,macos,tvos/37E](/list/platform/ios,macos,tvos/37E)

#### Live Badge

| Keyword | Preview | URL |
| --- | --- | --- |
| npm version | ![](/npm/v/express) | [/npm/v/express](/npm/v/express)
| npm version | ![](/npm/v/marked) | [/npm/v/marked](/npm/v/marked)
| npm version (scoped) | ![](/npm/v/@nestjs/core) | [/npm/v/@nestjs/core](/npm/v/@nestjs/core)
| npm downloads/day | ![](/npm/dd/express) | [/npm/dd/express](/npm/dd/express)
| npm downloads/week | ![](/npm/dw/express) | [/npm/dw/express](/npm/dw/express)
| npm downloads/month | ![](/npm/dm/express) | [/npm/dm/express](/npm/dm/express)
| crates.io version | ![](/crates/v/regex) | [/crates/v/regex](/crates/v/regex)
| crates.io downloads | ![](/crates/d/regex) | [/crates/d/regex](/crates/d/regex)
| crates.io downloads/latest | ![](/crates/dl/regex) | [/crates/dl/regex](/crates/dl/regex)
| chrome extension version | ![](/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension users | ![](/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension price | ![](/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension rating | ![](/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension stars | ![](/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| chrome extension rating count | ![](/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | [/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk](/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)
| homebrew version | ![](/homebrew/v/fish) | [/homebrew/v/fish](/homebrew/v/fish)
| homebrew version | ![](/homebrew/v/cake) | [/homebrew/v/cake](/homebrew/v/cake)
| travis | ![](/travis/amio/micro-cors) | [/travis/amio/micro-cors](/travis/amio/micro-cors)
| travis | ![](/travis/styfle/packagephobia) | [/travis/styfle/packagephobia](/travis/styfle/packagephobia)
| circleci | ![](/circleci/github/amio/now-go) | [/circleci/github/amio/now-go](/circleci/github/amio/now-go)
| circleci (branch) | ![](/circleci/github/amio/now-go/master) | [/circleci/github/amio/now-go/master](/circleci/github/amio/now-go/master)
| appveyor ci | ![](/appveyor/ci/gruntjs/grunt) | [/appveyor/ci/gruntjs/grunt](/appveyor/ci/gruntjs/grunt)

## About

Made with ❤️ by [Amio](https://github.com/amio)
<span style="float:right; color: #AAA">
  <a href="https://github.com/amio/badgen">badgen</a> |
  <a href="https://github.com/amio/badgen-service">badgen-service</a>
</span>
