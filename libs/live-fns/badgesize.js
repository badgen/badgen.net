const got = require('../got.js')

module.exports = async (topic, ...path) => {
  if (!topic) {
    return {
      status: 'missing topic'
    }
  }

  const endpoint = `https://img.badgesize.io/${path.join('/')}.json`
  const { prettySize, color } = await got(endpoint, {
    query: {
      compression: topic === 'normal' ? '' : topic
    }
  }).then(res => res.body)

  return {
    subject: topic === 'normal' ? 'size' : `${topic} size`,
    status: prettySize,
    color: color
  }
}
