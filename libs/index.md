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

![](/badge//airbnb?icon=airbnb)
![](/badge//apple?icon=apple)
![](/badge//appveyor?icon=appveyor)
![](/badge//atom?icon=atom)
![](/badge//chrome?icon=chrome)
![](/badge//circleci?icon=circleci)
![](/badge//codeclimate?icon=codeclimate)
![](/badge//codecov?icon=codecov)
![](/badge//codeship?icon=codeship)
![](/badge//dependabot?icon=dependabot)
![](/badge//dockbit?icon=dockbit)
![](/badge//docker?icon=docker)
![](/badge//eclipse?icon=eclipse)
![](/badge//firefox?icon=firefox)
![](/badge//github?icon=github)
![](/badge//gitlab?icon=gitlab)
![](/badge//gitter?icon=gitter)
![](/badge//graphql?icon=graphql)
![](/badge//haskell?icon=haskell)
![](/badge//npm?icon=npm)
![](/badge//patreon?icon=patreon)
![](/badge//ruby?icon=ruby)
![](/badge//scrutinizer?icon=scrutinizer)
![](/badge//slack?icon=slack)
![](/badge//sourcegraph?icon=sourcegraph)
![](/badge//terminal?icon=terminal)
![](/badge//travis?icon=travis)
![](/badge//twitter?icon=twitter)
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
|![](/badge/Swift/4.2/orange) | [/badge/Swift/4.2/orange](/badge/Swift/4.2/orange)
|![](/badge/license/MIT/blue) | [/badge/license/MIT/blue](/badge/license/MIT/blue)
|![](/badge/chat/on%20gitter/cyan) | [/badge/chat/on%20gitter/cyan](/badge/chat/on%20gitter/cyan)
|![](/badge/stars/★★★★☆/green) | [/badge/stars/★★★★☆](/badge/stars/★★★★☆/green)
|![](/badge/become/a%20patron/F96854) | [/badge/become/a%20patron/F96854](/badge/become/a%20patron/F96854)
|![](/badge/code%20style/standard/f2a) | [/badge/code%20style/standard/f2a](/badge/code%20style/standard/f2a)
|![](/badge/platform/ios,macos,tvos?list=1) | [/badge/platform/ios,macos,tvos?list=1](/badge/platform/ios,macos,tvos?list=1)

<div id="live-badge-examples"></div>

<script>
  window.liveBadges = {
    /* source control */
    github: [
      ['latest release', '/github/release/babel/babel'],
      ['latest stable release', '/github/release/babel/babel/stable'],
      ['latest tag', '/github/tag/micromatch/micromatch'],
      ['watchers', '/github/watchers/micromatch/micromatch'],
      ['stars', '/github/stars/micromatch/micromatch'],
      ['forks', '/github/forks/micromatch/micromatch'],
      ['issues', '/github/issues/micromatch/micromatch'],
      ['open issues', '/github/open-issues/micromatch/micromatch'],
      ['closed issues', '/github/closed-issues/micromatch/micromatch'],
      ['PRs', '/github/prs/micromatch/micromatch'],
      ['open PRs', '/github/open-prs/micromatch/micromatch'],
      ['closed PRs', '/github/closed-prs/micromatch/micromatch'],
      ['merged PRs', '/github/merged-prs/micromatch/micromatch'],
      ['commits', '/github/commits/micromatch/micromatch'],
      ['branches', '/github/branches/micromatch/micromatch'],
      ['releases', '/github/releases/micromatch/micromatch'],
      ['tags', '/github/tags/micromatch/micromatch'],
      ['license', '/github/license/micromatch/micromatch'],
      ['last commit', '/github/last-commit/micromatch/micromatch'],
      ['total downloads', '/github/dt/electron/electron'],
      ['repository dependents', '/github/dependents-repo/micromatch/micromatch'],
      ['package dependents', '/github/dependents-pkg/micromatch/micromatch']
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
      ['license', '/packagist/license/monolog/monolog'],
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
    apm: [
      ['version', '/apm/v/linter'],
      ['license', '/apm/license/linter'],
      ['downloads', '/apm/dl/linter'],
      ['stars', '/apm/stars/linter'],
    ],
    hackage: [
      ['version', '/hackage/v/abt'],
      ['version', '/hackage/v/Cabal'],
      ['license', '/hackage/license/Cabal']
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
    'code climate': [
      ['lines of code', '/codeclimate/loc/jekyll/jekyll'],
      ['issues', '/codeclimate/issues/jekyll/jekyll'],
      ['technical debt', '/codeclimate/tech-debt/jekyll/jekyll'],
      ['maintainability', '/codeclimate/maintainability/jekyll/jekyll'],
      ['maintainability (percentage)', '/codeclimate/maintainability-percentage/jekyll/jekyll'],
      ['coverage', '/codeclimate/coverage/jekyll/jekyll'],
      ['coverage (letter)', '/codeclimate/coverage-letter/jekyll/jekyll']
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
