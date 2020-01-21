import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Keybase',
  examples: {
    '/keybase/pgp/lukechilds': 'pgp key',
  },
  handlers: {
    '/keybase/:topic<pgp>/:username': handler
  }
})

async function handler ({ topic, username }: PathArgs) {
  const endpoint = `https://keybase.io/_/api/1.0/user/lookup.json`
  const result = await ky(endpoint, {
    searchParams: {
      usernames: username,
      fields: 'public_keys'
    }
  }).then(res => res.json())

  const fingerprint = result.them[0].public_keys.primary.key_fingerprint

  switch (topic) {
    case 'pgp':
      return {
        subject: 'PGP',
        status: convertFingerprintTo64bit(fingerprint),
        color: 'blue'
      }
  }
}

const convertFingerprintTo64bit = fingerprint => {
  return fingerprint.slice(-16).toUpperCase().match(/.{4}/g).join(' ')
}
