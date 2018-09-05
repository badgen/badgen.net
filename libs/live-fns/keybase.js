const got = require('../got.js')

const convertFingerprintTo64bit = fingerprint => fingerprint.slice(-16).toUpperCase().match(/.{1,4}/g).join(' ')

module.exports = async (topic, username) => {
  const endpoint = `https://keybase.io/_/api/1.0/user/lookup.json`
  const { body } = await got(endpoint, {
    query: {
      usernames: username,
      fields: 'public_keys'
    }
  })
  const user = body.them[0]

  switch (topic) {
    case 'pgp':
      return {
        subject: 'PGP',
        status: convertFingerprintTo64bit(user.public_keys.primary.key_fingerprint),
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
