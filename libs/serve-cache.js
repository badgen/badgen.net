const { send } = require('micro')
const { router, get } = require('micro-fork')
const liveFunctions = require('./live-fns/_index.js')
const liveFetcher = require('./live-fetcher.js')

const apiHandlers = Object.entries(liveFunctions).map(([name, fn]) => {
  return get(`/${name}/*`, async (req, res) => {
    send(res, 200, await liveFetcher(name, fn, req.params['*']))
  })
})

module.exports = router()(
  ...apiHandlers
)
