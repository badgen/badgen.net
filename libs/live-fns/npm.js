const r2 = require('r2')
const millify = require('millify')

module.exports = async function (method, ...args) {
  switch (method) {
    case 'v':
      return v(args)
    case 'dd':
      return d('last-day', args)
    case 'dw':
      return d('last-week', args)
    case 'dm':
      return d('last-month', args)
    default:
      return {
        subject: 'npm',
        status: 'unknown',
        color: 'grey'
      }
  }
}

// npm download
async function d (period, args) {
  const endpoint = `https://api.npmjs.org/downloads/point/${period}/${args.join('/')}`
  const stats = await r2(endpoint).json
  return {
    subject: 'downloads',
    status: millify(stats.downloads) + period.replace('last-', '%2F'),
    color: 'green'
  }
}

// npm version
async function v (args) {
  const version = await fetchLatestVersion(args)

  return {
    subject: 'npm',
    status: `v${version}`,
    color: version.split('.')[0] === '0' ? 'orange' : 'blue'
  }
}

async function fetchLatestVersion (args) {
  const scoped = args.length === 2 && args[0][0] === '@'
  let endpoint
  // Due to an bug of npm registry api, scoped package need to be handled
  // separately: https://github.com/npm/registry/issues/34
  // A workaround is using version range("*" for "latest") by Andrew Goode:
  // https://github.com/npm/registry/issues/34#issuecomment-228349870
  if (scoped) {
    endpoint = `https://registry.npmjs.org/${args.join('%2F')}/*`
  } else {
    endpoint = `https://registry.npmjs.org/${args}/latest`
  }
  return (await r2(endpoint).json).version
}
