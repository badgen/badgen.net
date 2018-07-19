const axios = require('../axios.js')

module.exports = async function (user, repo, branch = 'master') {
  const com = `https://api.travis-ci.com/${user}/${repo}.svg?branch=${branch}`
  const org = `https://api.travis-ci.org/${user}/${repo}.svg?branch=${branch}`
  const results = await Promise.all([
    axios.get(com).then(res => res.data).catch(e => e),
    axios.get(org).then(res => res.data).catch(e => e)
  ])

  if (results[0].match('passing') || results[1].match('passing')) {
    return {
      subject: 'build',
      status: 'passing',
      color: 'green'
    }
  }

  if (results[0].match('failed') || results[1].match('failed')) {
    return {
      subject: 'build',
      status: 'failed',
      color: 'red'
    }
  }

  return {
    subject: 'build',
    status: 'unknown',
    color: 'grey'
  }
}
