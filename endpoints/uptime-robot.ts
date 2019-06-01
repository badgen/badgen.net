import got from '../libs/got'
import { scale } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Uptime Robot',
  examples: {
    '/uptime-robot/status/m780862024-50db2c44c703e5c68d6b1ebb': 'status',
    '/uptime-robot/day/m780862024-50db2c44c703e5c68d6b1ebb': '(24 hours) uptime',
    '/uptime-robot/week/m780862024-50db2c44c703e5c68d6b1ebb': '(past week) uptime',
    '/uptime-robot/month/m780862024-50db2c44c703e5c68d6b1ebb': '(past month) uptime',
    '/uptime-robot/response/m780862024-50db2c44c703e5c68d6b1ebb': '(last hour) response',
  }
}

export const handlers: Handlers = {
  '/uptime-robot/:topic<status|day|week|month|response>/:apikey': handler
}

export default badgenServe(handlers)

/**
 * DOCS
 *    https://uptimerobot.com/api
 *
 * USAGE
 *    /uptime-robot/:topic/:api_key
 *      :api_key are generated from uptimerobot settings page
 */
async function handler ({ topic, apikey }: Args) {
  const endpoint = `https://api.uptimerobot.com/v2/getMonitors`
  const { monitors } = await got.post(endpoint, {
    body: {
      api_key: apikey,
      custom_uptime_ratios: '1-7-30',
      response_times: 1,
      response_times_limit: 12
    }
  }).then(res => res.body)

  /* eslint-disable camelcase */
  const { status, custom_uptime_ratio, average_response_time } = monitors[0]

  switch (topic) {
    case 'status':
      const _stat = statuses[status]
      return {
        subject: 'status',
        status: _stat ? _stat[0] : 'unknown',
        color: _stat ? _stat[1] : 'grey'
      }
    case 'day':
      return uptime('past-day', custom_uptime_ratio)
    case 'week':
      return uptime('past-week', custom_uptime_ratio)
    case 'month':
      return uptime('past-month', custom_uptime_ratio)
    case 'response':
      return {
        subject: 'response',
        status: average_response_time + 'ms',
        color: 'blue'
      }
  }
}

const statuses = {
  0: ['paused', 'yellow'],
  1: ['not checked yet', 'grey'],
  2: ['up', 'green'],
  8: ['seems down', 'orange'],
  9: ['down', 'red']
}

const uptime = (period, ratios) => {
  const [day, week, month] = ratios.split('-').map(r => parseFloat(r))
  switch (period) {
    case 'past-day':
      return {
        subject: 'uptime /24h',
        status: day + '%',
        color: ratioColor(day)
      }
    case 'past-week':
      return {
        subject: 'uptime /week',
        status: week + '%',
        color: ratioColor(week)
      }
    case 'past-month':
      return {
        subject: 'uptime /month',
        status: month + '%',
        color: ratioColor(month)
      }
  }
}

const ratioColor = scale(
  [94, 97, 99, 99.9],
  ['red', 'orange', 'EA2', '9C1', 'green']
)
