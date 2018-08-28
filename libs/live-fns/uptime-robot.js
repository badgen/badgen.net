const axios = require('../axios.js')
const scale = require('../utils/scale.js')

/**
 * DOCS
 *    https://uptimerobot.com/api
 *
 * USAGE
 *    /uptime-robot/:topic/:api_key
 *      :api_key are generated from uptimerobot settings page
 */
module.exports = async (topic, apiKey) => {
  const endpoint = `https://api.uptimerobot.com/v2/getMonitors`
  const options = {
    api_key: apiKey,
    custom_uptime_ratios: '1-7-30',
    response_times: 1,
    response_times_limit: 12
  }
  const { monitors } = await axios.post(endpoint, options).then(res => res.data)

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
    default:
      return {
        subject: 'uptime robot',
        status: 'unknown topic',
        color: 'grey'
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
