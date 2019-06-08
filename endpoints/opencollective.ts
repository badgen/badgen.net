import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Open Collective',
  examples: {
    '/opencollective/backers/webpack': 'backers',
    '/opencollective/contributors/webpack': 'contributors',
    '/opencollective/balance/webpack': 'balance',
    '/opencollective/yearly/webpack': 'yearly income',
  }
}

export const handlers: Handlers = {
  '/opencollective/:topic<backers|contributors|balance|yearly>/:slug': handler
}

export default badgenServe(handlers)

// https://developer.opencollective.com/#/api/collectives

async function handler ({ topic, slug }: Args) {
  const endpoint = `https://opencollective.com/${slug}.json`

  const details = await got(endpoint).then(res => res.body)
  const localeOptions = {
    style: 'currency',
    currency: details.currency
  }

  switch (topic) {
    case 'backers':
      return {
        subject: 'backers',
        status: details.backersCount,
        color: 'green'
      }
    case 'contributors':
      return {
        subject: 'contributors',
        status: details.contributorsCount,
        color: 'green'
      }
    case 'balance':
      return {
        subject: 'balance',
        status: (details.balance / 100).toLocaleString('en-US', localeOptions),
        color: 'green'
      }
    case 'yearly':
      return {
        subject: 'yearly income',
        status: (details.yearlyIncome / 100).toLocaleString('en-US', localeOptions),
        color: 'green'
      }
  }
}
