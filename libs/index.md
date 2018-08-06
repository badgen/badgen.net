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

Available icons:

![](/badge//travis?icon=travis)
![](/badge//circleci?icon=circleci)
![](/badge//appveyor?icon=appveyor)
![](/badge//dependabot?icon=dependabot)
![](/badge//codecov?icon=codecov)
![](/badge//docker?icon=docker)
![](/badge//github?icon=github)
![](/badge//gitlab?icon=gitlab)
![](/badge//slack?icon=slack)
![](/badge//gitter?icon=gitter)
![](/badge//firefox?icon=firefox)
![](/badge//chrome?icon=chrome)
![](/badge//twitter?icon=twitter)
![](/badge//terminal?icon=terminal)
![](/badge//airbnb?icon=airbnb)
![](/badge//patreon?icon=patreon)
![](/badge//apple?icon=apple)
![](/badge//windows?icon=windows)

Available query params:

| param | desc |
| ----- | ---- |
|`label`| Override default subject text ([URL-Encoding][url-enc-href] needed for spaces or special characters).
|`emoji`| Set `emoji=1` if subject/status text contains emoji.
| `list`| Set `list=1` will replace `,` with ` \| ` in status text. [e.g.][list-eg-href]
| `icon`| Use builtin icon in front of subject text. [e.g.][icon-eg-href]

## Examples

#### Static Badge

| Preview | URL |
| ------- | --- |
|![](/badge/Swift/4.2/orange) | [/badge/Swift/4.0/orange](/badge/Swift/4.2/orange)
|![](/badge/license/MIT/blue) | [/badge/license/MIT/blue](/badge/license/MIT/blue)
|![](/badge/chat/on%20gitter/cyan) | [/badge/chat/on%20gitter/cyan](/badge/chat/on%20gitter/cyan)
|![](/badge/stars/★★★★☆/green) | [/badge/stars/★★★★☆](/badge/stars/★★★★☆/green)
|![](/badge/become/a%20patron/F96854) | [/badge/become/a%20patron/F96854](/badge/become/a%20patron/F96854)
|![](/badge/code%20style/standard/f2a) | [/badge/code%20style/standard/f2a](/badge/code%20style/standard/f2a)
|![](/badge/▲/$%20now%20amio%2Fbadgen-service/222) | [/badge/▲/$%20now%20amio%2Fbadgen-service/222](/badge/▲/$%20now%20amio%2Fbadgen-service/222)
|![](/badge/platform/iOS,macOS,watchOS,tvOS?list=1) | [/badge/platform/iOS,macOS,watchOS,tvOS?list=1](/badge/platform/iOS,macOS,watchOS,tvOS?list=1)

<div id="live-badge-examples"></div>

<script>
  window.liveBadges = {
    /* source control */
    github: [
      ['latest release', '/github/release/babel/babel'],
      ['latest stable release', '/github/release/babel/babel/stable'],
      ['latest tag', '/github/tag/micromatch/micromatch'],
      ['stars', '/github/stars/micromatch/micromatch'],
      ['forks', '/github/forks/micromatch/micromatch'],
      ['watchers', '/github/watchers/micromatch/micromatch'],
      ['issues', '/github/issues/micromatch/micromatch'],
      ['open issues', '/github/open-issues/micromatch/micromatch']
    ],
    /* release registries */
    npm: [
      ['version', '/npm/v/express'],
      ['version', '/npm/v/babel-core'],
      ['version', '/npm/v/ava'],
      ['version (tag)', '/npm/v/ava/next'],
      ['version (tag)', '/npm/v/next/canary'],
      ['version (scoped)', '/npm/v/@babel/core'],
      ['version (scoped & tag)', '/npm/v/@nestjs/core/beta'],
      ['weekly downloads', '/npm/dw/express'],
      ['monthly downloads', '/npm/dm/express'],
      ['yearly downloads', '/npm/dy/express'],
      ['total downloads', '/npm/dt/express'],
      ['license', '/npm/license/lodash'],
      ['engines (node)', '/npm/node/express'],
      ['dependents', '/npm/dependents/got']
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
      ['license', '/pypi/license/pip']
    ],
    nuget: [
      ['version (stable)', '/nuget/v/newtonsoft.json'],
      ['version (pre)', '/nuget/v/newtonsoft.json/pre'],
      ['version (latest)', '/nuget/v/newtonsoft.json/latest']
    ],
    packagist: [
      ['version (stable)', '/packagist/v/monolog/monolog'],
      ['version (pre)', '/packagist/v/monolog/monolog/pre'],
      ['version (latest)', '/packagist/v/monolog/monolog/latest'],
      ['total downloads', '/packagist/dt/monolog/monolog'],
      ['daily downloads', '/packagist/dd/monolog/monolog'],
      ['monthly downloads', '/packagist/dm/monolog/monolog'],
      ['favers', '/packagist/favers/monolog/monolog'],
      ['dependents', '/packagist/dependents/monolog/monolog'],
      ['suggesters', '/packagist/suggesters/monolog/monolog'],
      ['name', '/packagist/n/monolog/monolog'],
      ['github stars', '/packagist/ghs/monolog/monolog'],
      ['github watchers', '/packagist/ghw/monolog/monolog'],
      ['github forks', '/packagist/ghf/monolog/monolog'],
      ['github issues', '/packagist/ghi/monolog/monolog'],
      ['language', '/packagist/lang/monolog/monolog'],
    ],
    rubygems: [
      ['version (stable)', '/rubygems/v/rails'],
      ['version (pre)', '/rubygems/v/rails/pre'],
      ['version (latest)', '/rubygems/v/rails/latest'],
      ['total downloads', '/rubygems/dt/rails'],
      ['version downloads', '/rubygems/dv/rails'],
      ['name', '/rubygems/n/rails'],
      ['platform', '/rubygems/p/rails'],
    ],
    /* CIs */
    travis: [
      ['build', '/travis/babel/babel'],
      ['build (branch)', '/travis/babel/babel/6.x']
    ],
    circleci: [
      ['build', '/circleci/github/nuxt/nuxt.js'],
      ['build (branch)', '/circleci/github/nuxt/nuxt.js/master']
    ],
    appveyor: [
      ['build', '/appveyor/ci/gruntjs/grunt'],
      ['build (branch)', '/appveyor/ci/gruntjs/grunt/deprecate']
    ],
    codecov: [
      ['coverage (github)', '/codecov/c/github/tunnckoCore/gitcommit'],
      ['coverage (github, branch)', '/codecov/c/github/babel/babel/6.x'],
      ['coverage (bitbucket)', '/codecov/c/bitbucket/ignitionrobotics/ign-math'],
      ['coverage (bitbucket, branch)', '/codecov/c/bitbucket/ignitionrobotics/ign-math/master'],
      ['coverage (gitlab)', '/codecov/c/gitlab/gitlab-org/gitaly'],
      ['coverage (gitlab, branch)', '/codecov/c/gitlab/gitlab-org/gitaly/master']
    ],
    coveralls: [
      ['coverage (github)', '/coveralls/c/github/jekyll/jekyll'],
      ['coverage (github, branch)', '/coveralls/c/github/jekyll/jekyll/master'],
      ['coverage (bitbucket)', '/coveralls/c/bitbucket/pyKLIP/pyklip'],
      ['coverage (bitbucket, branch)', '/coveralls/c/bitbucket/pyKLIP/pyklip/master'],
    ],
    /* quality & metrics */
    'david-dm': [
      ['dependencies', '/david/dep/zeit/pkg'],
      ['dev dependencies', '/david/dev/zeit/pkg'],
      ['peer dependencies', '/david/peer/epoberezkin/ajv-keywords'],
      ['optional dependencies', '/david/optional/epoberezkin/ajv-keywords'],
    ],
    packagephobia: [
      ['install size', '/packagephobia/install/webpack'],
      ['publish size', '/packagephobia/publish/webpack'],
      ['publish size (scoped)', '/packagephobia/publish/@tusbar/cache-control']
    ],
    bundlephobia: [
      ['minified', '/bundlephobia/min/react'],
      ['minified + gzip', '/bundlephobia/minzip/react'],
      ['(scoped) minified + gzip', '/bundlephobia/minzip/@nuxtjs/axios']
    ],
    'uptime robot': [
      ['status', '/uptime-robot/status/m780731617-a9e038618dc1aee36a44c4af'],
      ['(24 hours) uptime', '/uptime-robot/day/m780731617-a9e038618dc1aee36a44c4af'],
      ['(past week) uptime', '/uptime-robot/week/m780731617-a9e038618dc1aee36a44c4af'],
      ['(past month) uptime', '/uptime-robot/month/m780731617-a9e038618dc1aee36a44c4af'],
      ['(last hours) response', '/uptime-robot/response/m780731617-a9e038618dc1aee36a44c4af']
    ],
    /* utilities */
    'opencollective': [
      ['backers', '/opencollective/backers/webpack'],
      ['contributors', '/opencollective/contributors/webpack'],
      ['balance', '/opencollective/balance/webpack'],
      ['yearly income', '/opencollective/yearly/webpack'],
    ],
    'apm': [
      ['version', '/apm/v/linter'],
      ['license', '/apm/license/linter'],
      ['downloads', '/apm/dl/linter'],
      ['stars', '/apm/stars/linter'],
    ]
  }

  window.links = {
    packagephobia: { doc: true },
    'uptime robot': { doc: true },
  }
</script>

<script>
  // Update usage url for 'flat.badgen.net'
  if (window.location.hostname === 'flat.badgen.net') {
    const code = document.querySelector('pre code')
    code.innerText = code.innerText.replace(
      'badgen.net',
      'flat.badgen.net'
    ).replace(/\n/g, '\n     ')
  }
</script>

<script type="module">
  // Render live badge examples
  import { html, render } from 'https://cdn.jsdelivr.net/npm/lit-html@0.10.2/lit-html.js'

  const genExamples = (badges, links) => html`
    <h4 id="live-badge">Live Badge</h4>
    <div>${Object.entries(badges).map(([service, examples]) => html`
      <dl>
        <dt id="${service}">
          <a class="title" href="#${service}">${service}</a>
          ${links[service] && links[service].doc ?
            html`<a class="doc" href="/docs/${service.replace(/ /m, '-')}" target="_blank">?</a>` : ''}
        </dt>
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
  const only = new URL(window.location).searchParams.get('only')
  const badges = only ? { [only]: window.liveBadges[only] } : window.liveBadges

  render(
    genExamples(badges, window.links),
    document.querySelector('#live-badge-examples')
  )
</script>

[url-enc-href]: https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding
[style-eg-href]: /badge/color/blue/blue?style=flat
[list-eg-href]: /badge/platform/ios,macos,tvos?list=1
[icon-eg-href]: /badge/docker/v1.2.3/blue?icon=docker
