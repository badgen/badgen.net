const serveMarked = require('serve-marked')

module.exports = serveMarked('README.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    body { color: #333 }
    a { text-decoration: none; color: #06D }
    a:hover { text-decoration: underline }
    table { border-spacing: 0 }
    td { padding: 2px 1em 0 0; font: 14px/14px sans-serif }
    td a { font: 14px/14px monospace; vertical-align: top }
  `,
  googleAnalyticsID: 'UA-4646421-14'
})
