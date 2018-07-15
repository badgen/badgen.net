const r2 = require('r2')
const millify = require('millify')

module.exports = async function (method, ...args) {
  const endpoint = `https://crates.io/api/v1/crates/${args[0]}`
  const meta = await r2(endpoint, {
    headers: { 'Accept': 'application/json' }
  }).json

  switch (method) {
    case 'v':
      return {
        subject: 'crates',
        status: 'v' + meta.crate.max_version,
        color: ''
      }
    case 'd':
      return {
        subject: 'downloads',
        status: millify(meta.crate.downloads),
        color: 'green'
      }
    case 'dl':
      return {
        subject: 'downloads',
        status: millify(meta.crate.recent_downloads) + ' latest version',
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
