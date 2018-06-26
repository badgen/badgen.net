const fs = require('fs')
const r2 = require('r2')
const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const badgen = require('badgen')
const LRU = require('lru-cache')

const cache = new LRU({ max: 1000 })

function serveBadge (req, res, params) {
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'public, max-age=60'
  })

  const cached = cache.get(req.url)
  if (cached) {
    res.end(cached)
  } else {
    const created = badgen(params)
    cache.set(req.url, created)
    res.end(created)
  }
}

function serveListBadge (req, res, params) {
  const { subject, status, color } = params
  serveBadge(req, res, { subject, status: status.replace(/,/g, ' | '), color })
}

function cleanCache (req, res) {
  const count = cache.length
  const keys = cache.keys().join('\n')
  cache.reset()

  res.writeHead(200)
  res.end(`Cleaned ${count}\n${keys}`)
}

function serveMarkdown (file) {
  let content = fs.readFileSync(file, 'utf-8')
  r2.post('https://md.now.sh', {
    json: {
      text: content,
      title: 'Badgen - fast badge generator',
      linkCSS: 'https://unpkg.com/github-markdown-css',
      inlineCSS: `
        body { width: 760px; margin: 0 auto; font: 16px/1.8em Merriweather, sans-serif }
        h1, h2, h3, h4, h5 { margin: 1.5em 0 }
        h1 { font-size: 3rem }
        thead { display: none }
        td { line-height: 18px }
        td a { position: relative; top: -2px; left: 12px }
        pre {
          padding: 16px;
          overflow: auto;
          font-size: 85%;
          line-height: 1.45;
          background-color: #f6f8fa;
          border-radius: 3px; }
      `
    }
  }).text.then(html => (content = html))

  return (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(content)
  }
}

router.get('/badge/:subject/:status', serveBadge)
router.get('/badge/:subject/:status/:color', serveBadge)
router.get('/list/:subject/:status', serveListBadge)
router.get('/list/:subject/:status/:color', serveListBadge)
router.get('/', serveMarkdown('README.md'))
router.get('/clean-cache', cleanCache)

const handler = cors((req, res) => router.lookup(req, res))
const server = http.createServer(handler)
server.listen(3000)
