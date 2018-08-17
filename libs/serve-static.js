const serveHandler = require('serve-handler')

module.exports = async (req, res) => {
  await serveHandler(req, res, {
    public: 'static',
    rewrites: [
      { source: '/static/:rest', destination: '/:rest' }
    ]
  })
}
