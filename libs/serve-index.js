const serveMarked = require('serve-marked')

module.exports = serveMarked('libs/index.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    body { max-width: 860px }
    table { border-spacing: 0 }
    td { padding: 0 1em 0 0; font-size: 12px; white-space: nowrap; height: 26px }
    td img { height: 20px; position: relative; top: 2px }
    td a { font: 12px/14px monospace }
  `,
  trackingGA: 'UA-4646421-14'
})
