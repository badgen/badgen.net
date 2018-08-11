const got = require('got')

module.exports = got.extend({
  json: true,
  timeout: 3200
})
