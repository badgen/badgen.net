const axios = require('../axios.js')
const millify = require('millify')

// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
// https://unpkg.com/

module.exports = async function npm (method, ...args) {
  switch (method) {
    case 'v':
      return version(args)
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

async function download (period, args) {
  const endpoint = ['https://api.npmjs.org/downloads']
  const isTotal = period === 'total'

  if (isTotal) {
    const today = new Date()

    endpoint.push(`/range/2005-01-01:${today.getFullYear() + 1}-01-01`)
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

async function version (args) {
  // Due to an bug of npm registry api, scoped package need to be handled
  // separately: https://github.com/npm/registry/issues/34
  // A workaround is using version range("*" for "latest") by Andrew Goode:
  // https://github.com/npm/registry/issues/34#issuecomment-228349870
  const scoped = args.length === 2 && args[0][0] === '@'
  const endpoint = scoped
    ? `https://registry.npmjs.org/${args.join('%2F')}/*`
    : `https://registry.npmjs.org/${args}/latest`
  const { version } = await axios.get(endpoint).then(res => res.data)

  return {
    subject: 'npm',
    status: `v${version}`,
    color: version.split('.')[0] === '0' ? 'orange' : 'blue'
  }
}
