const axios = require('../axios.js')

const getPGPFingerprint = user => {
  const fingerprint = user.public_keys.primary.key_fingerprint

  // Convert to 64-bit fingerprint
  return fingerprint.substr(fingerprint.length - 16).toUpperCase().match(/.{1,4}/g).join(' ')
}

module.exports = async (topic, username) => {
  const endpoint = `https://keybase.io/_/api/1.0/user/lookup.json?usernames=${username}`
  const {data} = await axios.get(endpoint)
  const user = data.them[0]

  switch (topic) {
    case 'pgp':
      return {
        subject: 'PGP',
        status: getPGPFingerprint(user),
        color: 'blue'
      }
    default:
      return {
        subject: 'Keybase',
        status: 'unknown',
        color: 'grey'
      }
  }
}
