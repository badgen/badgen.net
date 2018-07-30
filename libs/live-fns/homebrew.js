const axios = require('../axios.js')
const semColor = require('../utils/sem-color.js')

module.exports = async function (topic, ...args) {
  const endpoint = `https://formulae.brew.sh/api/formula/${args[0]}.json`
  const { versions } = await axios.get(endpoint).then(res => res.data)

  switch (topic) {
    case 'v':
      return {
        subject: 'homebrew',
        status: 'v' + versions.stable,
        color: semColor(versions.stable)
      }
    default:
      return {
        subject: 'homebrew',
        status: 'unknown',
        color: 'grey'
      }
  }
}
