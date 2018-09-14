const got = require('../got.js')

// https://developer.opencollective.com/#/api/collectives

module.exports = async (topic, slug) => {
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
