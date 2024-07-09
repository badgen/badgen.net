import got from '../../libs/got'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Liberapay',
  examples: {
    '/liberapay/gives/aurelienpierre': 'giving',
    '/liberapay/receives/GIMP': 'receiving',
    '/liberapay/patrons/microG': 'patrons count',
    '/liberapay/goal/Changaco': 'goal progress',
  },
  handlers: {
    '/liberapay/:topic<gives|receives|patrons|goal>/:slug': handler
  }
})

// https://github.com/badges/shields/blob/master/services/liberapay

async function handler ({ topic, slug }: PathArgs) {
  const endpoint = `https://liberapay.com/${slug}/public.json`

  const details = await got(endpoint).json<any>()
  const receivingLocaleOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: details.giving.currency
  }
  const givingLocaleOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: details.receiving.currency
  }

  let goal = 'not set'
  if (details.goal) {
    const goalAmount = parseFloat(details.goal.amount)
    const receivesAmount = parseFloat(details.receiving.amount)
    goal = `${Math.round((receivesAmount / goalAmount) * 100)}%`
  }

  switch (topic) {
    case 'gives':
      return {
        subject: 'gives',
        status: `${parseFloat(details.giving.amount).toLocaleString('en-US', givingLocaleOptions)}/week`,
        color: 'yellow'
      }
    case 'receives':
      return {
        subject: 'receives',
        status: `${parseFloat(details.receiving.amount).toLocaleString('en-US', receivingLocaleOptions)}/week`,
        color: 'yellow'
      }
    case 'patrons':
      return {
        subject: 'patrons',
        status: details.npatrons,
        color: 'yellow'
      }
    case 'goal':
      return {
        subject: 'goal progress',
        status: goal,
        color: goal !== 'not set' ? 'yellow' : 'grey'
      }
    default:
      return {
        subject: 'liberapay',
        status: 'unknown',
        color: 'grey'
      }
  }
}
