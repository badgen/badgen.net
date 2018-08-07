const axios = require('../axios.js')

/**
 * EXAMPLES
 *
 *     /runkit/satisfaction-flq08o9mm3ka/102909/employee
 *     /runkit/satisfaction-flq08o9mm3ka/102909/people
 *     /runkit/satisfaction-flq08o9mm3ka/102909/topic
 */

module.exports = async function (endpointId, ...args) {
  const endpoint = `https://${endpointId}.runkit.sh/${args.join('/')}`
  const { subject, status, color } = await axios(endpoint).then(res => res.data)

  if (subject && status) {
    return { subject, status, color }
  }
}
