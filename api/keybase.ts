import got from '../libs/got'
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
  const body = await got(endpoint, {
    searchParams: {
      usernames: username,
      fields: 'public_keys'
    }
  }).json<any>()

  const fingerprint = body.them[0].public_keys.primary.key_fingerprint

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
