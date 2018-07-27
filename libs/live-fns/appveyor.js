const axios = require('../axios.js')

module.exports = async function (topic, ...args) {
  switch (topic) {
    case 'ci':
      return ci(...args)
    default:
      return {
        subject: 'appveyor',
        status: 'unknown',
        color: 'grey'
      }
  }
}

async function ci (account, project, branch) {
  branch = branch ? `/branch/${branch}` : ''
  const endpoint = `https://ci.appveyor.com/api/projects/${account}/${project}${branch}`
  const { build } = await axios.get(endpoint).then(res => res.data)
  return {
    subject: 'appveyor',
    status: build.status,
    color: build.status === 'success' ? 'green' : 'red'
  }
}
