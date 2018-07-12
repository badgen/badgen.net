const serveMarked = require('serve-marked')

module.exports = serveMarked('README.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    table { border-spacing: 0 }
    td { padding: 0 1em 0 0; white-space: nowrap }
    td a { font: 14px/14px monospace; vertical-align: top }
  `,
  trackingGA: 'UA-4646421-14'
})
