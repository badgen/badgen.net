# Badgen

Fast badge generating service.

## Usage

```
https://badgen.now.sh/badge/:subject/:status/:color
                      ──┬──  ───┬───  ───┬──  ──┬──
                        │       │        │      └ RGB / Color Name
                        │      TEXT     TEXT
                        │
                      badge - Default badge generator
                       list - Auto replace ',' with ' | ' in {status}
```

Available color names:

![](https://badgen.now.sh/badge/color/green/green)
![](https://badgen.now.sh/badge/color/yellow/yellow)
![](https://badgen.now.sh/badge/color/orange/orange)
![](https://badgen.now.sh/badge/color/red/red)
![](https://badgen.now.sh/badge/color/pink/pink)
![](https://badgen.now.sh/badge/color/purple/purple)
![](https://badgen.now.sh/badge/color/blue/blue)
![](https://badgen.now.sh/badge/color/grey/grey)

## Examples

| Preview | URL |
| --- | --- |
|![](https://badgen.now.sh/badge/chat/gitter/purple) | https://badgen.now.sh/badge/chat/gitter/purple |
|![](https://badgen.now.sh/badge/style/standard/f2a) | https://badgen.now.sh/badge/style/standard/f2a |
|![](https://badgen.now.sh/badge/stars/★★★★☆) | https://badgen.now.sh/badge/stars/★★★★☆ |
|![](https://badgen.now.sh/badge/license/Apache-2.0/blue) | https://badgen.now.sh/badge/license/Apache-2.0/blue |
|![](https://badgen.now.sh/list/platform/ios,macos,tvos/grey) | https://badgen.now.sh/list/platform/ios,macos,tvos/grey |

## License

ISC @ Amio https://github.com/amio/badgen-service
