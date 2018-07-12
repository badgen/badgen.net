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

![](https://badgen.now.sh/badge/color/blue/blue)
![](https://badgen.now.sh/badge/color/cyan/cyan)
![](https://badgen.now.sh/badge/color/green/green)
![](https://badgen.now.sh/badge/color/yellow/yellow)
![](https://badgen.now.sh/badge/color/orange/orange)
![](https://badgen.now.sh/badge/color/red/red)
![](https://badgen.now.sh/badge/color/pink/pink)
![](https://badgen.now.sh/badge/color/purple/purple)
![](https://badgen.now.sh/badge/color/grey/grey)

## Examples

#### Static Badge

| Preview | URL |
| --- | --- |
|![](https://badgen.now.sh/badge/chat/gitter/purple) | https://badgen.now.sh/badge/chat/gitter/purple |
|![](https://badgen.now.sh/badge/style/standard/f2a) | https://badgen.now.sh/badge/style/standard/f2a |
|![](https://badgen.now.sh/badge/stars/★★★★☆) | https://badgen.now.sh/badge/stars/★★★★☆ |
|![](https://badgen.now.sh/badge/license/Apache-2.0/blue) | https://badgen.now.sh/badge/license/Apache-2.0/blue |
|![](https://badgen.now.sh/list/platform/ios,macos,tvos/grey) | https://badgen.now.sh/list/platform/ios,macos,tvos/grey |

#### Live Badge

| Keyword | Preview | URL |
| --- | --- | --- |
| npm version | ![](https://badgen.now.sh/npm/v/express) | https://badgen.now.sh/npm/v/express |
| npm dl/day | ![](https://badgen.now.sh/npm/dd/express) | https://badgen.now.sh/npm/dd/express |
| npm dl/week | ![](https://badgen.now.sh/npm/dw/express) | https://badgen.now.sh/npm/dw/express |
| npm dl/month | ![](https://badgen.now.sh/npm/dm/express) | https://badgen.now.sh/npm/dm/express |
| travis | ![](https://badgen.now.sh/travis/amio/micro-cors) | https://badgen.now.sh/travis/amio/micro-cors |
| circleci | ![](https://badgen.now.sh/circleci/github/amio/now-go) | https://badgen.now.sh/circleci/github/amio/now-go |
| appveyor | ![](https://badgen.now.sh/appveyor/github/gruntjs/grunt) | https://badgen.now.sh/appveyor/github/gruntjs/grunt |
| chrome extension version | ![](http://badgen.now.sh/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | https://badgen.now.sh/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk
| chrome extension users | ![](http://badgen.now.sh/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | https://badgen.now.sh/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk
| chrome extension price | ![](http://badgen.now.sh/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | https://badgen.now.sh/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk
| chrome extension rating | ![](http://badgen.now.sh/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | https://badgen.now.sh/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk
| chrome extension stars | ![](http://badgen.now.sh/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | https://badgen.now.sh/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk
| chrome extension rating count | ![](http://badgen.now.sh/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk) | https://badgen.now.sh/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk

## About

Made with ❤️ by [Amio](https://github.com/amio)
<span style="float:right; color: #AAA">
  <a href="https://github.com/amio/badgen-service">badgen-service</a> |
  <a href="https://github.com/amio/badgen">badgen</a>
</span>
