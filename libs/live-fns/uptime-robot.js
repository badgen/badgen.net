const axios = require('../axios.js')

/**
 * DOCS
 *    https://uptimerobot.com/api
 *
 * USAGE
 *    /uptime-robot/_topic_/_api_key_/_monitor_id_/
 */

module.exports = async function (topic, apiKey) {
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
      return uptime('last-day', custom_uptime_ratio)
    case 'week':
      return uptime('last-week', custom_uptime_ratio)
    case 'month':
      return uptime('last-month', custom_uptime_ratio)
    case 'response':
      return {
        subject: 'response',
        status: average_response_time + 'ms',
        color: 'green'
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

function uptime (period, ratios) {
  const [day, week, month] = ratios.split('-').map(r => parseFloat(r))
  switch (period) {
    case 'last-day':
      return {
        subject: 'uptime',
        status: day + '%',
        color: ratioColor(day)
      }
    case 'last-week':
      return {
        subject: 'uptime',
        status: week + '%',
        color: ratioColor(week)
      }
    case 'last-month':
      return {
        subject: 'uptime',
        status: month + '%',
        color: ratioColor(month)
      }
  }
}

function ratioColor (ratio) {
  if (ratio > 99) return 'green'
  if (ratio > 95) return 'yellow'
  if (ratio > 50) return 'orange'
  return 'red'
}
