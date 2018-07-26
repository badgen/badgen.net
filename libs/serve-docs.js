const fs = require('fs')
const path = require('path')
const serveMarked = require('serve-marked')
const serve404 = require('./serve-404.js')

const serveMarkedOptions = {
  preset: 'merri',
  inlineCSS: `
    body { max-width: 800px; padding: 0 2em 1em 2em }
    h1 { font-size:  }
    h1 + p { letter-spacing: 0.1px }
    h1 + p img { margin-top: 1em; height: 20px }
    em { font-size: 0.8em; color: #666 }
    li { padding: 0.4em 0 }
    li code { padding: 0.4em 0.6em; display: pre }
    p { margin: 0 }
    p a { vertical-align: top; margin-left: 0.4em; font: 14px/20px monospace }
  `,
  beforeHeadEnd: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
  trackingGA: 'UA-4646421-14'
}

const docsFolder = path.join(__dirname, 'docs')
const docHandlers = fs.readdirSync(docsFolder).reduce((map, filename) => {
  const key = filename.replace('.md', '')
  const title = `Usage of /${key} - Badgen`
  const options = { title, ...serveMarkedOptions }
  map[key] = serveMarked(path.join(docsFolder, filename), options)
  return map
}, {})

module.exports = (req, res) => {
  const handler = docHandlers[req.params.topic]
  if (handler) {
    return handler(req, res)
  } else {
    return serve404(req, res)
  }
}
