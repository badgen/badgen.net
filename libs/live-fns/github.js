const axios = require('../axios.js')

// https://developer.github.com/v3/repos/

module.exports = async function (method, ...args) {
  switch (method) {
    case 'release':
      return release('release', args)
    case 'tag':
      return release('tag', args)
    default:
      return {
        subject: 'github',
        status: 'unknown',
        color: 'grey'
      }
  }
}

async function release (topic, args) {
  const endpoint = `https://api.github.com/repos/${args.join('/')}/${topic}s`
  const meta = await axios.get(endpoint).then(res => res.data)

  const [first] = meta

  return {
    subject: topic,
    status: first.name || first.tag_name || 'unknown',
    color: first.prerelease === true ? 'orange' : 'blue'
  }
}
