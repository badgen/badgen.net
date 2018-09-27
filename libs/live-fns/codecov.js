const got = require('../got.js')
const covColor = require('../utils/cov-color.js')
const covFormat = require('../utils/cov-format.js')

const unknownBadge = {
  subject: 'codecov',
  status: 'unknown',
  color: 'grey'
}

module.exports = async (topic, vscType, ...args) => {
  switch (topic) {
    case 'c': {
      switch (vscType) {
        case 'gh':
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

const coverage = async (vscType, user, repo, branch) => {
  const args = [vscType, user, repo]
  if (typeof branch === 'string') {
    args.push('branch', branch)
  }

  const endpoint = `https://codecov.io/api/${args.join('/')}`
  const data = await got(endpoint).then(res => res.body)

  return {
    subject: 'coverage',
    status: covFormat(data.commit.totals.c),
    color: covColor(data.commit.totals.c)
  }
}
