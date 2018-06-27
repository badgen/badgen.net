const fs = require('fs')
const r2 = require('r2')
const http = require('http')
const cors = require('@amio/micro-cors')()
const router = require('find-my-way')()
const badgen = require('badgen')
const LRU = require('lru-cache')

const cache = new LRU({ max: 1000 })

function serveBadge (req, res, params) {
  const result = cache.get(req.url) || badgen(params)
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'public, max-age=360'
  })
  res.end(result)

  // Cache if not
  cache.has(req.url) || cache.set(req.url, result)
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

function listCache (req, res) {
  res.writeHead(200)
  res.end(`Total ${cache.length}\n${cache.keys().join('\n')}`)
}

function serveMarkdown (file) {
  let content = fs.readFileSync(file, 'utf-8')
  r2.post('https://md.now.sh', {
    json: {
      text: content,
      title: 'Badgen - fast badge generator',
      linkCSS: 'https://unpkg.com/github-markdown-css',
      inlineCSS: `
        body { max-width: 760px; padding: 0 1rem; margin: 0 auto; font: 16px Merriweather, sans-serif }
        h1, h2, h3, h4, h5 { margin: 1.6em 0 }
        h1 { font-size: 3rem; text-align: center; margin-bottom: 0.6em }
        h1 + p { text-align: center; color: #AAA }
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
router.get('/list-cache', listCache)
router.all('/*', (req, res) => {
  res.statusCode = 404
  res.end()
})

const handler = cors((req, res) => {
  try {
    router.lookup(req, res)
  } catch (ex) {
    console.error(ex)
    res.statusCode = 500
    res.end()
  }
})
const server = http.createServer(handler)
server.listen(3000)
