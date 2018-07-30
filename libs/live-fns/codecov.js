const axios = require('../axios.js')
const covColor = require('../utils/cov-color.js')

// https://codecov.io/gh/user/repo/settings/badge

/**
 * `gh` is alias for `github` set by CodeCov
 * /codecov/c/github/amio/badgen
 * /codecov/c/github/amio/badgen/master
 */
module.exports = async function codecov (topic, ...args) {
  switch (topic) {
    case 'c': {
      return coverage(...args)
    }
    default:
      return {
        subject: 'codecov',
        status: 'unknown',
        color: 'grey'
      }
  }
}

async function coverage (vscType, user, repo, branch) {
  branch = typeof branch === 'string' && branch.length > 0 ? branch : 'master'

  const args = [vscType, user, repo, 'branch', branch]
  const endpoint = `https://codecov.io/${args.join('/')}/graph/badge.txt`

  const status = String(await axios.get(endpoint).then(res => res.data)).trim()

  if (status === 'unknown') {
    return {
      subject: 'codecov',
      status: 'unknown',
      color: 'grey'
    }
  }

  return {
    subject: 'codecov',
    status: `${status}%`,
    color: covColor(status)
  }
}
