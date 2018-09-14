const got = require('../got.js')
const covColor = require('../utils/cov-color.js')
const covFormat = require('../utils/cov-format.js')

module.exports = async (topic, platform, user, repo, branch) => {
  switch (topic) {
    case 'c':
      return coverage(platform, user, repo, branch)
    default:
      return {
        status: 'unknown topic'
      }
  }
}

// Detect coveralls.io's badge redirection instead of using it's api
// See https://github.com/amio/badgen-service/issues/96
const coverage = async (platform, user, repo, branch) => {
  const endpoint = `https://coveralls.io/repos/${platform}/${user}/${repo}/badge.svg`
  const badgeURL = await got.head(endpoint, {
    json: false,
    query: { branch },
    // Expecting 302 redirection to "coveralls_xxx.svg"
    followRedirect: false
  }).then(res => res.headers.location)

  try {
    const percentage = badgeURL.match(/_(\d+)\.svg/)[1]
    return {
      subject: 'coverage',
      status: covFormat(percentage),
      color: covColor(Number(percentage))
    }
  } catch (e) {
    return {
      subject: 'coverage',
      status: 'invalid'
    }
  }
}
