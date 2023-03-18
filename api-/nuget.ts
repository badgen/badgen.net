import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'NuGet',
  examples: {
    '/nuget/v/Newtonsoft.Json': 'version (stable channel)',
    '/nuget/v/Newtonsoft.Json/pre': 'version (pre channel)',
    '/nuget/v/Newtonsoft.Json/latest': 'version (latest channel)',
    '/nuget/dt/Newtonsoft.Json': 'total downloads',
  },
  handlers: {
    '/nuget/v/:project/:channel?': handler,
    '/nuget/dt/:project': downloads
  }
})

const pre = versions => versions.filter(v => v.includes('-'))
const stable = versions => versions.filter(v => !v.includes('-'))
const latest = versions => versions.length > 0 && versions.slice(-1)[0]

async function handler ({ project, channel }: PathArgs) {
  const endpoint = `https://api.nuget.org/v3-flatcontainer/${project.toLowerCase()}/index.json`
  const { versions } = await got(endpoint).json<any>()

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

async function downloads ({ project }: PathArgs) {
  const endpoint = `https://azuresearch-usnc.nuget.org/query`
  const searchParams = {
    q: `packageid:${project.toLowerCase()}`,
    prerelease: true,
    semVerLevel: 2
  }
  const { data } = await got.get(endpoint, { searchParams }).json<any>()

  return {
    subject: 'downloads',
    status: millify(data[0].totalDownloads),
    color: 'green'
  }
}
