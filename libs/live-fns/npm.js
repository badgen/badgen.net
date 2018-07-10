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

// npm version
async function v (args) {
  const version = await fetchVersion(args.join('%2F'), args[0][0] === '@')

  return {
    subject: 'npm',
    status: `v${version}`,
    color: version.split('.')[0] === '0' ? 'orange' : 'blue'
  }
}

async function fetchVersion (pkg, scoped) {
  // Due to an bug of npm registry api, scoped package need to be handled
  // separately: https://github.com/npm/registry/issues/34
  if (scoped) {
    const endpoint = `https://registry.npmjs.org/${pkg}`
    const fullMeta = (await r2(endpoint).json)
    return fullMeta.versions[fullMeta['dist-tags']['latest']].version
  } else {
    // a smaller response for just latest version
    const endpointLatest = `https://registry.npmjs.org/${pkg}/latest`
    return (await r2(endpointLatest).json).version
  }
}

// npm download
async function d (period, args) {
  const endpoint = `https://api.npmjs.org/downloads/point/${period}/${args.join('/')}`
  const counts = await r2(endpoint).json
  return {
    subject: 'downloads',
    status: millify(counts.downloads) + period.replace('last-', '%2F'),
    color: 'green'
  }
}
