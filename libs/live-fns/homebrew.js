const axios = require('../axios.js')

module.exports = async function (method, ...args) {
  const endpoint = `https://formulae.brew.sh/api/formula/${args[0]}.json`
  const { versions } = await axios.get(endpoint).then(res => res.data)

  switch (method) {
    case 'v':
      return {
        subject: 'homebrew',
        status: 'v' + versions.stable,
        color: versions.stable[0] === '0' ? 'orange' : 'blue'
      }
    default:
      return {
        subject: 'homebrew',
        status: 'unknown',
        color: 'grey'
      }
  }
}
