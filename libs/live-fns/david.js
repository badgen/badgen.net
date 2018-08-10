const axios = require('../axios.js')

const statusInfo = {
  insecure: ['insecure', 'red'],
  outofdate: ['out of date', 'orange'],
  notsouptodate: ['up to date', 'yellow'],
  uptodate: ['up to date', 'green'],
  none: ['none', 'blue']
}

module.exports = async (depType, user, repo) => {
  const prefix = {
    dep: '',
    dev: 'dev-',
    peer: 'peer-',
    optional: 'optional-'
  }[depType]
  const endpoint = `https://david-dm.org/${user}/${repo}/${prefix}info.json`
  const { status } = await axios.get(endpoint).then(res => res.data)

  switch (depType) {
    case 'dep':
      return {
        subject: 'dependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
    case 'dev':
      return {
        subject: 'devDependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
    case 'peer':
      return {
        subject: 'peerDependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
    case 'optional':
      return {
        subject: 'optionalDependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
  }
}
