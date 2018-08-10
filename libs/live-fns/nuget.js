const axios = require('../axios.js')
const prefixVersion = require('../utils/prefix-version.js')
const semColor = require('../utils/sem-color.js')

const pre = versions => versions.filter(v => v.includes('-'))
const stable = versions => versions.filter(v => !v.includes('-'))
const latest = versions => versions.length > 0 && versions.slice(-1)[0]

module.exports = async function (method, project, channel) {
  const endpoint = `https://api.nuget.org/v3-flatcontainer/${project}/index.json`
  const { versions } = await axios.get(endpoint).then(res => res.data)

  switch (method) {
    case 'v':
      let version = ''

      switch (channel) {
        case 'latest':
          version = latest(versions)
          break
        case 'pre':
          version = latest(pre(versions))
          break
        default: // get stable version
          version = latest(stable(versions))
      }

      // in case version is still empty, try to get the latest
      version = version || latest(versions)

      return {
        subject: 'nuget',
        status: version ? prefixVersion(version) : 'unknown',
        color: semColor(version)
      }
    default:
      return {
        subject: 'nuget',
        status: 'unknown',
        color: 'grey'
      }
  }
}
