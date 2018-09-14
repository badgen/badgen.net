const got = require('../got.js')

module.exports = async (topic, ...args) => {
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

const ci = async (account, project, branch) => {
  branch = branch ? `/branch/${branch}` : ''
  const endpoint = `https://ci.appveyor.com/api/projects/${account}/${project}${branch}`
  const { build } = await got(endpoint).then(res => res.body)

  return {
    subject: 'appveyor',
    status: build.status,
    color: build.status === 'success' ? 'green' : 'red'
  }
}
