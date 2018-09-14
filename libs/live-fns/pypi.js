const got = require('../got.js')
const semColor = require('../utils/sem-color.js')
const v = require('../utils/version-formatter.js')

module.exports = async (topic, project) => {
  const endpoint = `https://pypi.org/pypi/${project}/json`
  const { info } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'v':
      return {
        subject: 'pypi',
        status: v(info.version),
        color: semColor(info.version)
      }
    case 'license':
      return {
        subject: 'license',
        status: info.license || 'unknown',
        color: 'blue'
      }
    default:
      return {
        subject: 'pypi',
        status: 'unknown',
        color: 'grey'
      }
  }
}
