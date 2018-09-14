const got = require('../got.js')
const millify = require('millify')
const semColor = require('../utils/sem-color.js')
const v = require('../utils/version-formatter.js')

module.exports = async (topic, pkg) => {
  const endpoint = `https://crates.io/api/v1/crates/${pkg}`
  const { crate } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'v':
      return {
        subject: 'crates.io',
        status: v(crate.max_version),
        color: semColor(crate.max_version)
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
