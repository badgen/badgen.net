const axios = require('../axios.js')

/**
 * EXAMPLES
 *
 *     /runkit/satisfaction-flq08o9mm3ka/102909/employee
 *     /runkit/satisfaction-flq08o9mm3ka/102909/people
 *     /runkit/satisfaction-flq08o9mm3ka/102909/topic
 */
module.exports = async (endpointId, ...args) => {
  const endpoint = `https://${endpointId}.runkit.sh/${args.join('/')}`
  return axios(endpoint).then(res => res.data)
}
