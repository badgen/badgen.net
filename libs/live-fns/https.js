const axios = require('../axios.js')

/**
 * EXAMPLES
 *
 *     /https/some-endpoint.now.sh
 *     /https/another-endpoint.runkit.sh
 */
module.exports = async (url, ...args) => {
  const endpoint = `https://${url.replace(/\/$/, '')}/${args.join('/')}`
  return axios(endpoint).then(res => res.data)
}
