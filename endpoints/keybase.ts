import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Keybase',
  examples: {
    '/keybase/pgp/lukechilds': 'pgp key',
  }
}

export const handlers: Handlers = {
  '/keybase/:topic<pgp>/:username': handler
}

export default badgenServe(handlers)

async function handler ({ topic, username }: Args) {
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
  }
}

const convertFingerprintTo64bit = fingerprint => {
  return fingerprint.slice(-16).toUpperCase().match(/.{4}/g).join(' ')
}
