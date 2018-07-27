const serveMarked = require('serve-marked')

module.exports = serveMarked('libs/index.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    body { max-width: 920px; padding-bottom: 1em }
    h1 + p { letter-spacing: 0.1px }
    h1 + p a { display: inline-block; margin-top: 1em; padding: 4px; height: 20px }
    h1 + p img { height: 20px }

    table { border-spacing: 0; vertical-align: top }
    td { padding-right: 0.6em; height: 28px; font-size: 14px; white-space: nowrap }
    td img { position: relative; top: 2px }
    td a { font: 14px/20px monospace }
    pre, code { background-color: #f2f5f9; font-weight: 400 }
    pre > code { padding: 0 }
    table code { padding: 0.3em 0.5em; display: pre }

    dt { margin: 1em 0; border-bottom: 1px solid #DDD; line-height: 2em }
    dd { font: 14px/20px monospace; vertical-align: top; height: 28px; white-space: nowrap; margin: 0 }
    dd img { vertical-align: top }
    dd b { display: inline-block; min-width: 14em; text-align: right; font-weight: 300 }
    dd i { display: inline-block; min-width: 13em }
  `,
  beforeHeadEnd: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
  trackingGA: 'UA-4646421-14'
})
