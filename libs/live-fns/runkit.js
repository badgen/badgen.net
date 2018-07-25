const axios = require('../axios.js')

module.exports = async function (account, notebook, ...args) {
  const endpoint = `https://runkit.io/${account}/${notebook}/branches/master?args=${args.join('/')}`
  const { subject, status, color } = await axios(endpoint).then(res => res.data)

  if (subject && status) {
    return { subject, status, color }
  }
}
