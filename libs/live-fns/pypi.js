const axios = require('../axios.js')

module.exports = async function (method, project) {
  const endpoint = `https://pypi.org/pypi/${project}/json`
  const { info } = await axios.get(endpoint).then(res => res.data)

  switch (method) {
    case 'v':
      return {
        subject: 'pypi',
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
