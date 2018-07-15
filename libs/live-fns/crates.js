const axios = require('../axios.js')
const millify = require('millify')

module.exports = async function (method, ...args) {
  const endpoint = `https://crates.io/api/v1/crates/${args[0]}`
  const { crate } = await axios.get(endpoint).then(res => res.data)

  switch (method) {
    case 'v':
      return {
        subject: 'crates.io',
        status: 'v' + crate.max_version,
        color: crate.max_version[0] === '0' ? 'orange' : 'blue'
      }
    case 'd':
      return {
        subject: 'downloads',
        status: millify(crate.downloads),
        color: 'green'
      }
    case 'dl':
      return {
        subject: 'downloads',
        status: millify(crate.recent_downloads) + ' latest version',
        color: 'green'
      }
    default:
      return {
        subject: 'crates',
        status: 'unknown',
        color: 'grey'
      }
  }
}
