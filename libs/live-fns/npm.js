const axios = require('../axios.js')
const millify = require('millify')

// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
// https://github.com/npm/registry/blob/master/docs/download-counts.md
// https://unpkg.com/

module.exports = async function npm (method, ...args) {
  switch (method) {
    case 'v':
      return npmVersion(args)
    case 'dt':
      return npmDownloads('total', args)
    case 'dd':
      return npmDownloads('last-day', args)
    case 'dw':
      return npmDownloads('last-week', args)
    case 'dm':
      return npmDownloads('last-month', args)
    case 'dy':
      return npmDownloads('last-year', args)
    case 'license':
      return pkg('license', args)
    case 'node':
      return pkg('node', args)
    default:
      return {
        subject: 'npm',
        status: 'unknown',
        color: 'grey'
      }
  }
}

async function pkg (topic, args) {
  const endpoint = `https://unpkg.com/${args.join('/')}/package.json`
  const meta = await axios.get(endpoint).then(res => res.data)

  switch (topic) {
    case 'license':
      return {
        subject: 'license',
        status: meta.license || 'unknown',
        color: 'blue'
      }
    case 'node':
      return {
        subject: 'node',
        status: (meta.engines && meta.engines.node) || '*',
        color: 'green'
      }
  }
}

async function npmDownloads (period, args) {
  const endpoint = ['https://api.npmjs.org/downloads']
  const isTotal = period === 'total'

  if (isTotal) {
    const now = new Date()
    endpoint.push(`/range/2005-01-01:${now.getFullYear() + 1}-01-01`)
  } else if (period === 'last-day') {
    const beforeTwoDays = Date.now() - 172800000
    const dateBefore = new Date(beforeTwoDays)
    const [date] = dateBefore.toISOString().split('T')

    endpoint.push(`/point/${date}`)
  } else {
    endpoint.push(`/point/${period}`)
  }
  endpoint.push(`/${args.join('/')}`)

  const per = isTotal ? '' : period.replace('last-', '/')
  const stats = await axios.get(endpoint.join('')).then(res => res.data)

  if (isTotal) {
    stats.downloads = stats.downloads.reduce((prev, { downloads }) => {
      return prev + downloads
    }, 0)
  }

  return {
    subject: 'downloads',
    status: millify(stats.downloads) + per,
    color: 'green'
  }
}

async function npmVersion (args) {
  const isScoped = args[0].charAt(0) === '@'
  const name = isScoped ? [args[0], args[1]].join('%2F') : args[0]
  let parts = null
  let tag = args[1]

  if (isScoped) {
    parts = args[2] && args[2] !== 'latest' ? [name, args[2]] : [name]
    tag = parts[1]
  } else {
    parts = args[1] ? [name] : [name, 'latest']
  }

  const endpoint = `https://registry.npmjs.org/${parts.join('/')}`
  const data = await axios.get(endpoint).then(res => res.data)

  let version = null

  // pretty weird stuff
  if (isScoped && tag) {
    version = data.version
  } else if (isScoped && !tag) {
    version = data['dist-tags'].latest
  } else if (tag) {
    version = data['dist-tags'][tag]
  } else {
    version = data.version
  }

  return {
    subject: 'npm',
    status: `v${version}`,
    color: version.split('.')[0] === '0' ? 'orange' : 'blue'
  }
}
