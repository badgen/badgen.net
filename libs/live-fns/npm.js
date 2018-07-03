const r2 = require('r2')

module.exports = async function (...args) {
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
