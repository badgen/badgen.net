const got = require('../got.js')

module.exports = async (topic, ...args) => {
  const endpoint = `https://packagephobia.now.sh/v2/api.json?p=${args.join('/')}`
  const { install, publish } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'publish':
      return {
        subject: 'publish size',
        status: publish.pretty,
        color: publish.color.replace('#', '')
      }
    case 'install':
      return {
        subject: 'install size',
        status: install.pretty,
        color: install.color.replace('#', '')
      }
    default:
      return {
        subject: 'packagephobia',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}
