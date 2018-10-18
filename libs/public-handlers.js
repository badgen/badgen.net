const serveHandler = require('serve-handler')
const { get } = require('micro-fork')

const servePublicPages = (req, res) => {
  serveHandler(req, res, { public: 'public' })
}

const redirectTo = (target) => {
  return (req, res) => {
    res.writeHead(302, { 'Location': target })
    res.end()
  }
}

module.exports = [
  get('/_next/*', servePublicPages),
  get('/static/*', servePublicPages),
  get('/builder', servePublicPages),
  get('/gallery', redirectTo('/gallery/live')),
  get('/gallery/', redirectTo('/gallery/live')),
  get('/gallery/*', servePublicPages)
]
