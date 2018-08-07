const axios = require('../axios.js')
const cache = require('memory-cache')
const cron = require('cron')
const https = require('https')
const millify = require('millify')
const semColor = require('../utils/sem-color.js')

/**
 * Brackets extension statistics cannot be retrieved using a regular API
 * All the statistics must be extracted from a big file called the 'registry', which contains everything there is
 * to know about every extension.
 *
 * > curl https://brackets-registry.aboutweb.com/registryList -H "Accept: application/json" -k
 *
 * The registry is parsed at a regular interval, and extracted data is saved in memory.
 */

module.exports = async function (topic, pkg) {
  const ext = cache.get('brackets|' + pkg)
  if (!ext) {
    return {subject: 'brackets', status: 'unknown', color: 'grey'}
  }

  const dlBadge = status => {
    return {subject: 'downloads', status: status, color: 'green'}
  }

  switch (topic) {
    case 'dd':
      return dlBadge(millify(Math.round(ext.w / 7)) + '/day')
    case 'dw':
      return dlBadge(millify(ext.w) + '/week')
    case 'dt':
      return dlBadge(millify(ext.t))
    case 'dl':
      return dlBadge(millify(ext.l) + ' latest version')
    case 'v':
      return {subject: 'version', status: 'v' + ext.v, color: semColor(ext.v)}
    default:
      return {subject: 'brackets', status: 'unknown', color: 'grey'}
  }
}

// Fetch all data from the brackets registry
const getData = () => {
  axios.get('https://brackets-registry.aboutweb.com/registryList', {
    headers: {Accept: 'application/json'},
    httpsAgent: new https.Agent({rejectUnauthorized: false})
  }).then(res => {
    for (const result of res.data.registry) {
      const lastVersion = result.versions ? result.versions[result.versions.length - 1] : {}
      const weekDownloads = result.recent ? getWeekDownloads(result.recent) : 0

      cache.put('brackets|' + result.metadata.name, {
        w: weekDownloads,
        t: result.totalDownloads || 0,
        l: lastVersion.downloads || 0,
        v: lastVersion.version || ''
      })
    }
    console.info('#brackets retrieved ' + res.data.registry.length + ' extensions from the brackets registry')
  }, err => {
    console.error('#brackets error retrieving brackets data:', err)
  })
}

// Parse the 'recent' object and extract last week's downloads
function getWeekDownloads (recent) {
  let keys = Object.keys(recent)
  let last = keys[keys.length - 1]
  let day = new Date(last.substring(0, 4) + '-' + last.substring(4, 6) + '-' + last.substring(6, 8))
  let count = 0
  for (let x = 0; x < 7; x++) {
    const mm = day.getMonth() + 1
    const dd = day.getDate()
    const key = [day.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('')
    count += recent[key] ? recent[key] : 0
    day.setDate(day.getDate() - 1)
  }
  return count
}

// Fetch data every 2 hours
const job = new cron.CronJob('0 */2 * * *', () => getData())

// Initialisation
if (!cache.get('brackets_started')) {
  cache.put('brackets_started', true)
  getData()
  job.start()
}
