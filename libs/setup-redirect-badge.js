const redirectFns = require('./redirect-fns/_index.js')

module.exports = function (router) {
  Object.entries(redirectFns).forEach(([name, fn]) => {
    router.get(`/${name}/*`, (req, res, params) => {
      res.writeHead(302, {
        Location: fn(...params['*'].split('/'))
      })
      res.end()
    })
  })
}
