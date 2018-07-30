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

![](/badge//travis?icon=travis)
![](/badge//circleci?icon=circleci)
![](/badge//appveyor?icon=appveyor)
![](/badge//dependabot?icon=dependabot)
![](/badge//docker?icon=docker)
![](/badge//github?icon=github)
![](/badge//gitlab?icon=gitlab)
![](/badge//slack?icon=slack)
![](/badge//gitter?icon=gitter)
![](/badge//firefox?icon=firefox)
![](/badge//chrome?icon=chrome)
![](/badge//terminal?icon=terminal)

## Examples

#### Static Badge

| Preview | URL |
| ------- | --- |
|![](/badge/license/MIT/blue) | [/badge/license/MIT/blue](/badge/license/MIT/blue)
|![](/badge/style/standard/f2a) | [/badge/style/standard/f2a](/badge/style/standard/f2a)
|![](/badge/stars/★★★★☆/green) | [/badge/stars/★★★★☆](/badge/stars/★★★★☆/green)
|![](/badge/become/a%20patron/F96854?icon=patreon) | [/badge/become/a%20patron/F96854?icon=patreon](/badge/become/a%20patron/F96854?icon=patreon)
|![](/badge/platform/iOS,macOS,watchOS?list=1) | [/badge/platform/iOS,macOS,watchOS?list=1](/badge/platform/iOS,macOS,watchOS?list=1)
|![](/badge/▲%20Deploy%20to%20Now/$%20now%20amio%2Fbadgen-service/111) | [/badge/▲%20Deploy%20to%20Now/$%20now%20amio%2Fbadgen-service/111](/badge/▲%20Deploy%20to%20Now/$%20now%20amio%2Fbadgen-service/111)

<div id="live-badge-examples"></div>

<script>
  window.liveBadges = {
    /* source control */
    github: [
      // [ <desc>, <badge-image-src> ]
      ['latest release', '/github/release/babel/babel'],
      ['latest stable release', '/github/release/babel/babel/stable'],
      ['latest tag', '/github/tag/micromatch/micromatch'],
    ],
    /* release registries */
    npm: [
      ['version', '/npm/v/express'],
      ['version', '/npm/v/babel-core'],
      ['version', '/npm/v/ava'],
      ['version (tag)', '/npm/v/ava/next'],
      ['version (tag)', '/npm/v/next/canary'],
      ['version (scoped)', '/npm/v/@babel/core'],
      ['version (scoped)', '/npm/v/@babel/core/latest'],
      ['version (scoped & tag)', '/npm/v/@nestjs/core/beta'],
      ['weekly downloads', '/npm/dw/express'],
      ['monthly downloads', '/npm/dm/express'],
      ['yearly downloads', '/npm/dy/express'],
      ['total downloads', '/npm/dt/express'],
      ['license', '/npm/license/lodash'],
      ['engines (node)', '/npm/node/express']
    ],
    crates: [
      ['version', '/crates/v/regex'],
      ['downloads', '/crates/d/regex'],
      ['downloads (latest)', '/crates/dl/regex']
    ],
    docker: [
      ['pulls (library)', '/docker/pulls/library/ubuntu'],
      ['stars (library)', '/docker/stars/library/ubuntu'],
      ['pulls (scoped)', '/docker/pulls/amio/node-chrome'],
      ['stars (icon & label)', '/docker/stars/library/mongo?icon=docker&label=stars']
    ],
    homebrew: [
      ['version', '/homebrew/v/fish'],
      ['version', '/homebrew/v/cake']
    ],
    'chrome extension': [
      ['version', '/chrome-web-store/v/ckkdlimhmcjmikdlpkmbgfkaikojcbjk'],
      ['users', '/chrome-web-store/users/ckkdlimhmcjmikdlpkmbgfkaikojcbjk'],
      ['price', '/chrome-web-store/price/ckkdlimhmcjmikdlpkmbgfkaikojcbjk'],
      ['rating', '/chrome-web-store/rating/ckkdlimhmcjmikdlpkmbgfkaikojcbjk'],
      ['stars', '/chrome-web-store/stars/ckkdlimhmcjmikdlpkmbgfkaikojcbjk'],
      ['rating count', '/chrome-web-store/rating-count/ckkdlimhmcjmikdlpkmbgfkaikojcbjk']
    ],
    'mozilla add-on': [
      ['version', '/amo/v/markdown-viewer-chrome'],
      ['users', '/amo/users/markdown-viewer-chrome'],
      ['rating', '/amo/rating/markdown-viewer-chrome'],
      ['stars', '/amo/stars/markdown-viewer-chrome'],
      ['reviews', '/amo/reviews/markdown-viewer-chrome']
    ],
    pypi: [
      ['version', '/pypi/v/pip'],
      ['version', '/pypi/v/docutils'],
    ],
    /* CIs */
    travis: [
      ['build', '/travis/amio/micro-cors'],
      ['build (branch)', '/travis/babel/babel/6.x'],
      // ['build (icon)', '/travis/babel/babel?icon=travis'],
    ],
    circleci: [
      ['build', '/circleci/github/amio/now-go'],
      ['build (branch)', '/circleci/github/amio/now-go/master'],
      // ['build (icon)', '/circleci/github/amio/now-go?icon=circleci'],
    ],
    appveyor: [
      ['build', '/appveyor/ci/gruntjs/grunt'],
      // ['build (icon)', '/appveyor/ci/gruntjs/grunt?icon=appveyor']
    ],
    codecov: [
      ['coverage (github)', '/codecov/c/github/tunnckoCore/gitcommit'],
      ['coverage (github, branch)', '/codecov/c/github/babel/babel/6.x'],
      ['coverage (bitbucket)', '/codecov/c/bitbucket/ignitionrobotics/ign-math'],
      ['coverage (bitbucket, branch)', '/codecov/c/bitbucket/ignitionrobotics/ign-math/master']
    ],
    coveralls: [
      ['coverage (github)', '/coveralls/c/github/jekyll/jekyll'],
      ['coverage (github, branch)', '/coveralls/c/github/jekyll/jekyll/master'],
      ['coverage (bitbucket)', '/coveralls/c/bitbucket/pyKLIP/pyklip'],
      ['coverage (bitbucket, branch)', '/coveralls/c/bitbucket/pyKLIP/pyklip/master'],
    ],
    'david-dm': [
      ['dependencies', '/david/dep/zeit/pkg'],
      ['dev dependencies', '/david/dev/zeit/pkg'],
      ['peer dependencies', '/david/peer/epoberezkin/ajv-keywords'],
      ['optional dependencies', '/david/optional/epoberezkin/ajv-keywords'],
    ],
    /* quality & metrics */
    packagephobia: [
      ['publish size', '/packagephobia/publish/webpack'],
      ['install size', '/packagephobia/install/webpack']
    ],
    'uptime robot': [
      ['status', '/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af'],
      ['(24 hours) uptime', '/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af'],
      ['(past week) uptime', '/uptime-robot/week/m780731617-a9e038618dc1aee36a44c4af'],
      ['(past month) uptime', '/uptime-robot/month/m780731617-a9e038618dc1aee36a44c4af'],
      ['(last hours) response', '/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af']
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
  // Update usage url for 'flat.badgen.net'
  if (window.location.hostname === 'flat.badgen.net') {
    const code = document.querySelector('pre code')
    code.innerText = code.innerText.replace(
      'badgen.net',
      'flat.badgen.net'
    ).replace(/\\n/g, '\\n     ')
  }
</script>

<script type="module">
  // Render live badge examples
  import { html, render } from 'https://cdn.jsdelivr.net/npm/lit-html@0.10.2/lit-html.js'

  const genExamples = (badges) => html`
    <h4 id="live-badge">Live Badge</h4>
    <div>${Object.entries(badges).map(([service, examples]) => html`
      <dl>
        <dt id="${service}"><a href="#${service}">${service}</a></dt>
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

  // use "?only=npm" to show only "npm" badge examples
  const only = window.liveBadges[new URL(window.location).searchParams.get('only')]
  const badges = only ? { [only]: window.liveBadges[only] } : window.liveBadges

  render(
    genExamples(badges),
    document.querySelector('#live-badge-examples')
  )
</script>

[url-enc-href]: https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding
[style-eg-href]: /badge/color/blue/blue?style=flat
[list-eg-href]: /badge/platform/ios,macos,tvos?list=1
[icon-eg-href]: /badge/docker/v1.2.3/blue?icon=docker
