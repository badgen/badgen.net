const axios = require('../axios.js')

const statusInfo = {
  'insecure': ['insecure', 'red'],
  'outofdate': ['out of date', 'orange'],
  'notsouptodate': ['up to date', 'yellow'],
  'uptodate': ['up to date', 'green'],
  'none': ['pending', 'grey']
}

module.exports = async function (depType, user, repo) {
  const endpoint = `https://david-dm.org/${user}/${repo}/info.json`
  const { status } = await axios.get(endpoint).then(res => res.data)

  switch (depType) {
    case 'dep':
      return {
        subject: 'dependencies',
        status: statusInfo[status][0],
        color: statusInfo[status][1]
      }
  }
}
