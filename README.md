# Badgen Service

Fast badge generating service.

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
|![](https://badgen.now.sh/badge/chat/gitter/purple) | [https://badgen.now.sh/badge/chat/gitter/purple](https://badgen.now.sh/badge/chat/gitter/purple)
|![](https://badgen.now.sh/badge/style/standard/f2a) | [https://badgen.now.sh/badge/style/standard/f2a](https://badgen.now.sh/badge/style/standard/f2a)
|![](https://badgen.now.sh/badge/license/Apache-2.0/blue) | [https://badgen.now.sh/badge/license/Apache-2.0/blue](https://badgen.now.sh/badge/license/Apache-2.0/blue)
|![](https://badgen.now.sh/badge/Language/Swift%203.0.1/orange) | [https://badgen.now.sh/badge/Language/Swift%203.0.1/orange](https://badgen.now.sh/badge/Language/Swift%203.0.1/orange)

#### Live Badge

For full list of live badges, see https://badgen.now.sh

## Developing

- `npm start` or better if you have nodemon: `nodemon service.js`

## About

Made with ❤️ by [Amio](https://github.com/amio),
built with ⚡️ from [badgen](https://github.com/amio/badgen).
