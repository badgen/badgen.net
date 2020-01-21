import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Open Collective',
  examples: {
    '/opencollective/backers/webpack': 'backers',
    '/opencollective/contributors/webpack': 'contributors',
    '/opencollective/balance/webpack': 'balance',
    '/opencollective/yearly/webpack': 'yearly income',
  },
  handlers: {
    '/opencollective/:topic<backers|contributors|balance|yearly>/:slug': handler
  }
})

// https://developer.opencollective.com/#/api/collectives

async function handler ({ topic, slug }: PathArgs) {
  const endpoint = `https://opencollective.com/${slug}.json`

  const details = await ky(endpoint).then(res => res.json())
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
