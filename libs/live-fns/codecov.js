const axios = require('../axios.js')

// https://codecov.io/gh/user/repo/settings/badge

/**
 * `gh` is alias for `github` set by CodeCov
 * badgen.now.sh/codecov/c/gh/amio/badgen
 * badgen.now.sh/codecov/c/gh/amio/badgen/master
 */
module.exports = async function codecov (method, ...args) {
  switch (method) {
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

function getColor (value, orange = 70, yellow = 85, green = 100) {
  if (value <= 0) {
    return 'red'
  }
  if (value < orange) {
    return 'ef6c00'
  }
  if (value < yellow) {
    return 'c0ca33'
  }
  if (value < green) {
    return 'a4a61d'
  }
  return 'green'
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

  const color = getColor(+status)

  return {
    subject: 'codecov',
    status: `${status}%`,
    color
  }
}
