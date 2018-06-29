const serveMarked = require('serve-marked')

module.exports = serveMarked('README.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    body { color: #333 }
    a { text-decoration: none }
    a:hover { text-decoration: underline }
    td a { font: 14px monospace; vertical-align: top; margin-left: 1em }
  `,
  googleAnalyticsID: 'UA-4646421-14'
})
