const axios = require('../axios.js')

module.exports = async function (user, repo, branch = 'master') {
  const com = `https://api.travis-ci.com/${user}/${repo}.svg?branch=${branch}`
  const org = `https://api.travis-ci.org/${user}/${repo}.svg?branch=${branch}`
  const res = await Promise.all([
    axios.get(com).then(({ data }) => data).catch(e => e),
    axios.get(org).then(({ data }) => data).catch(e => e)
  ])

  if (res[0].match(/passed|passing/) || res[1].match(/passed|passing/)) {
    return {
      subject: 'build',
      status: 'passing',
      color: 'green'
    }
  }

  if (res[0].match(/failed|failing/) || res[1].match(/failed|failing/)) {
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
