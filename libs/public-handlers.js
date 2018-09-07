const serveHandler = require('serve-handler')
const { get } = require('micro-fork')

const servePublicPages = (req, res) => {
  serveHandler(req, res, { public: 'public' })
}

module.exports = [
  get('/_next/*', servePublicPages),
  get('/static/*', servePublicPages),
  get('/builder', servePublicPages)
]
