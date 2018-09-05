const got = require('../got.js')

const convertFingerprintTo64bit = fingerprint => {
  return fingerprint.slice(-16).toUpperCase().match(/.{4}/g).join(' ')
}

module.exports = async (topic, username) => {
  const endpoint = `https://keybase.io/_/api/1.0/user/lookup.json`
  const { body } = await got(endpoint, {
    query: {
      usernames: username,
      fields: 'public_keys'
    }
  })

  const fingerprint = body.them[0].public_keys.primary.key_fingerprint

  switch (topic) {
    case 'pgp':
      return {
        subject: 'PGP',
        status: convertFingerprintTo64bit(fingerprint),
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
