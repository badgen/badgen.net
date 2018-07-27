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

Available query params:

| param | desc |
| ----- | ---- |
|`label`| Override default subject text ([URL-Encoding][url-enc-href] needed for spaces or special characters).
|`style`| Force flat style with `style=flat`. [e.g.][style-eg-href]
|`emoji`| Set `emoji=1` if subject/status text contains emoji.
| `list`| Set `list=1` will replace `,` with ` \| ` in status text. [e.g.][list-eg-href]
| `icon`| Use builtin icon in front of label. [e.g.][icon-eg-href]

Available icons:

![](/badge/icon/travis?icon=travis)
![](/badge/icon/appveyor?icon=appveyor)
![](/badge/icon/circleci?icon=circleci)
![](/badge/icon/github?icon=github)
![](/badge/icon/docker?icon=docker)
![](/badge/icon/mozillafirefox?icon=mozillafirefox)
![](/badge/icon/googlechrome?icon=googlechrome)

## Examples

#### Static Badge

| Preview | URL |
| ------- | --- |
|![](/badge/chat/gitter/purple) | [/badge/chat/gitter/purple](/badge/chat/gitter/purple)
|![](/badge/style/standard/f2a) | [/badge/style/standard/f2a](/badge/style/standard/f2a)
|![](/badge/stars/★★★★☆) | [/badge/stars/★★★★☆](/badge/stars/★★★★☆)
|![](/badge/license/Apache-2.0/blue) | [/badge/license/Apache-2.0/blue](/badge/license/Apache-2.0/blue)
|![](/badge/Language/Swift%203.0.1/orange) | [/badge/Language/Swift%203.0.1/orange](/badge/Language/Swift%203.0.1/orange)
|![](/badge/platform/ios,macos,tvos?list=1) | [/badge/platform/ios,macos,tvos?list=1](/badge/platform/ios,macos,tvos?list=1)

#### Live Badge

<div id="live-badge-examples"></div>

<script>
  window.liveBadges = {
    github: [
      ['release', '/github/release/babel/babel'],
      ['tag', '/github/tag/micromatch/micromatch'],
    ],
    packagephobia: [
      ['publish size', '/packagephobia/publish/webpack'],
      ['install size', '/packagephobia/install/webpack']
    ]
  }
</script>

## About

Made with ❤️ by [Amio](https://github.com/amio)
<span style="float:right; color: #AAA">
  <a href="https://github.com/amio/badgen-service">GitHub</a> |
  <a href="https://twitter.com/badgen_net">Twitter</a>
</span>

<script>
  if (window.location.hostname === 'flat.badgen.net') {
    const code = document.querySelector('pre code')
    code.innerText = code.innerText.replace(
      'badgen.net',
      'flat.badgen.net'
    ).replace(/\\n/g, '\\n     ')
  }
</script>

<script type="module">
  import { html, render } from 'https://cdn.jsdelivr.net/npm/lit-html@0.10.2/lit-html.js'

  const genExamples = (badges) => html`
    <div>${Object.entries(badges).map(([service, examples]) => html`
      <dl>
        <dt>${service}</dt>
        ${examples.map(([desc, src]) => html`
          <dd>
            <b>${desc}</b>
            <i><img src=${src} /></i>
            <span><a href=${src}>${src}</a></span>
          </dd>
        `)}
      </dl>
    `)}</div>
  `

  render(
    genExamples(window.liveBadges),
    document.querySelector('#live-badge-examples')
  )
</script>

[url-enc-href]: https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding
[style-eg-href]: /badge/color/blue/blue?style=flat
[list-eg-href]: /badge/platform/ios,macos,tvos?list=1
[icon-eg-href]: /badge/docker/v1.2.3/blue?icon=docker
