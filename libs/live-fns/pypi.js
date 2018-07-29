const axios = require('../axios.js')

module.exports = async function (method, ...args) {
  const endpoint = `https://pypi.org/pypi/${args[0]}/json`
  const { info } = await axios.get(endpoint).then(res => res.data)

  switch (method) {
    case 'v':
      return {
        subject: 'pypi.org',
        status: 'v' + info.version,
        color: info.version[0] === '0' ? 'orange' : 'blue'
      }
    default:
      return {
        subject: 'pypi',
        status: 'unknown',
        color: 'grey'
      }
  }
}
