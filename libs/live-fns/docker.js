const axios = require('../axios.js')
const millify = require('millify')

module.exports = async function (topic, namespace, name) {
  if (!['stars', 'pulls'].includes(topic)) {
    return {
      subject: 'docker',
      status: 'unknown topic',
      color: 'grey'
    }
  }

  /* eslint-disable camelcase */
  const endpoint = `https://hub.docker.com/v2/repositories/${namespace}/${name}`
  const { pull_count, star_count } = await axios(endpoint).then(res => res.data)

  switch (topic) {
    case 'stars':
      return {
        subject: 'stars',
        status: millify(star_count),
        color: 'blue'
      }
    case 'pulls':
      return {
        subject: 'pulls',
        status: millify(pull_count),
        color: 'blue'
      }
  }
}
