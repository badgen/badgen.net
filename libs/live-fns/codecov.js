const axios = require('../axios.js')
const covColor = require('../utils/cov-color.js')

const unknownBadge = {
  subject: 'codecov',
  status: 'unknown',
  color: 'grey'
}

module.exports = async function codecov (topic, vscType, ...args) {
  switch (topic) {
    case 'c': {
      switch (vscType) {
        case 'github':
          return coverage('gh', ...args)
        case 'bitbucket':
          return coverage('bb', ...args)
        case 'gitlab':
          return coverage('gl', ...args)
        default:
          return unknownBadge
      }
    }
    default:
      return unknownBadge
  }
}

async function coverage (vscType, user, repo, branch) {
  const args = [vscType, user, repo]
  if (typeof branch === 'string') {
    args.push('branch', branch)
  }

  const endpoint = `https://codecov.io/api/${args.join('/')}`
  const {data} = await axios.get(endpoint)

  return {
    subject: 'coverage',
    status: Number(data.commit.totals.c).toFixed(1) + '%',
    color: covColor(data.commit.totals.c)
  }
}
