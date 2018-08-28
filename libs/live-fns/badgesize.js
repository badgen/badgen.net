const axios = require('../axios.js')

module.exports = async (topic, ...path) => {
  const compression = topic === 'normal' ? '' : `?compression=${topic}`

  if (!topic) {
    return {
      status: 'missing topic'
    }
  }

  const subject = topic === 'normal' ? 'size' : `${topic} size`
  const endpoint = `https://img.badgesize.io/${path.join('/')}.json${compression}`
  const { prettySize, color } = await axios(endpoint).then(res => res.data)

  return {
    subject: subject,
    status: prettySize,
    color: color
  }
}
