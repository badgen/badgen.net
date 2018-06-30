const liveFns = require('./live-fns/index.js')

module.exports = function (router) {
  Object.entries(liveFns).forEach(([key, fn]) => {
    router.get(`/${key}/*`, async (req, res, params) => {
      // todo: cache
      const {
        subject = key,
        status = 'unknown',
        color = 'grey'
      } = await timeout(fn(params['*'].split('/')), 30000).catch(e => ({}))

      res.writeHead(302, {
        Location: `https://badgen.now.sh/badge/${subject}/${status}/${color}`
      })
      res.end()
    })
  })
}

function timeout (promise, period) {
  return Promise.race([
    new Promise((resolve, reject) => setTimeout(reject, period)),
    promise
  ])
}
