const axios = require('../axios.js')
const semColor = require('../utils/sem-color.js')

module.exports = async function (method, project, channel) {
  const endpoint = `https://api.nuget.org/v3-flatcontainer/${project}/index.json`
  const { versions } = await axios.get(endpoint).then(res => res.data)
  const unknownBadgeData = {
    subject: 'nuget',
    status: 'unknown',
    color: 'grey'
  }

  switch (method) {
    case 'v':
      let version = ''

      switch (channel) {
        case 'latest':
          if (versions.length > 0) {
            version = versions.slice(-1)[0]
          }
          break
        case 'pre':
          const preReleaseVersions = versions.filter(v => v.indexOf('-') !== -1)
          if (preReleaseVersions.length > 0) {
            version = preReleaseVersions.slice(-1)[0]
          }
          break
        default: // by default get stable version
          const stableVersions = versions.filter(v => v.indexOf('-') === -1)
          if (stableVersions.length > 0) {
            version = stableVersions.slice(-1)[0]
          }
      }

      // if in case version is still empty, try to get the latest
      if (!version && versions.length > 0) {
        version = versions.slice(-1)[0]
      }

      if (version) {
        return {
          subject: 'nuget',
          status: 'v' + version,
          color: semColor(version)
        }
      } else {
        return unknownBadgeData
      }
    default:
      return unknownBadgeData
  }
}
