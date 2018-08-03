const axios = require('../axios.js')
const millify = require('millify')
const semColor = require('../utils/sem-color.js')

// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
// https://github.com/npm/registry/blob/master/docs/download-counts.md
// https://unpkg.com/

module.exports = async function npm (topic, ...args) {
  switch (topic) {
    case 'v':
      return pkg('version', args)
    case 'dt':
      return download('total', args)
    case 'dd':
      return download('last-day', args)
    case 'dw':
      return download('last-week', args)
    case 'dm':
      return download('last-month', args)
    case 'dy':
      return download('last-year', args)
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
  let pkg = args[0]
  let tag = 'latest'
  const isScoped = args[0].charAt(0) === '@'

  if (isScoped) {
    pkg = `${args[0]}/${args[1]}`
    tag = args[2] || tag
  } else {
    tag = args[1] || tag
  }

  const endpoint = `https://unpkg.com/${pkg}@${tag}/package.json`
  const meta = await axios.get(endpoint).then(res => res.data)

  switch (topic) {
    case 'version': {
      return {
        subject: `npm${tag === 'latest' ? '' : '@' + tag}`,
        status: `v${meta.version}`,
        color: tag === 'latest' ? semColor(meta.version) : 'cyan'
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: meta.license || 'unknown',
        color: 'blue'
      }
    }
    case 'node': {
      return {
        subject: 'node',
        status: (meta.engines && meta.engines.node) || '*',
        color: 'green'
      }
    }
    default: {
      return {
        subject: 'npm',
        status: 'unknown',
        color: 'grey'
      }
    }
  }
}

async function download (period, args) {
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
