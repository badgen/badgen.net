import ky from '../libs/ky'
import { version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Nuget',
  examples: {
    '/nuget/v/newtonsoft.json': 'version (stable channel)',
    '/nuget/v/newtonsoft.json/pre': 'version (pre channel)',
    '/nuget/v/newtonsoft.json/latest': 'version (latest channel)',
  },
  handlers: {
    '/nuget/v/:project/:channel?': handler
  }
})

const pre = versions => versions.filter(v => v.includes('-'))
const stable = versions => versions.filter(v => !v.includes('-'))
const latest = versions => versions.length > 0 && versions.slice(-1)[0]

async function handler ({ project, channel }: PathArgs) {
  const endpoint = `https://api.nuget.org/v3-flatcontainer/${project}/index.json`
  const { versions } = await ky(endpoint).then(res => res.json())

  let ver = ''

  switch (channel) {
    case 'latest':
      ver = latest(versions)
      break
    case 'pre':
      ver = latest(pre(versions))
      break
    default:
      // get stable version
      ver = latest(stable(versions))
  }

  // in case version is still empty, try to get the latest
  ver = ver || latest(versions) || 'unknown'

  return {
    subject: 'nuget',
    status: version(ver),
    color: versionColor(ver)
  }
}
