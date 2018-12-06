const got = require('../got.js')
const millify = require('millify')

module.exports = async (topic, user) => {
  const endpoint = `http://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${user}`
  const [info] = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'follow':
      return {
        subject: `follow @${user}`,
        status: millify(info.followers_count),
        color: '1da1f2'
      }
    default:
      return {
        subject: `twitter`,
        status: `unknown topic`
      }
  }
}
