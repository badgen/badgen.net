import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const CRAN_API_URL = 'https://crandb.r-pkg.org/'
const CRANLOGS_API_URL = 'https://cranlogs.r-pkg.org/'

export default createBadgenHandler({
  title: 'CRAN',
  examples: {
    '/cran/v/dplyr': 'version',
    '/cran/license/ggplot2': 'license',
    '/cran/r/data.table': 'r version',
    '/cran/dependents/R6': 'dependents',
    '/cran/dt/Rcpp': 'total downloads',
    '/cran/dd/Rcpp': 'daily downloads',
    '/cran/dw/Rcpp': 'weekly downloads',
    '/cran/dm/Rcpp': 'monthly downloads'
  },
  handlers: {
    '/cran/:topic<v|version|license|r|dependents>/:pkg': cranHandler,
    '/cran/:topic<dd|dw|dm|dt>/:pkg': cranlogsHandler
  }
})

async function cranHandler ({ topic, pkg }: PathArgs) {
  const client = got.extend({ prefixUrl: CRAN_API_URL })

  switch (topic) {
    case 'v':
    case 'version': {
      const data = await client.get(pkg).json<any>()
      return {
        subject: 'cran',
        status: version(data.Version),
        color: versionColor(data.Version)
      }
    }
    case 'license': {
      const data = await client.get(pkg).json<any>()
      const license = data.License?.replace(/\s*\S\s+file\s+LICEN[CS]E$/i, '')
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
    case 'r': {
      const data = await client.get(pkg).json<any>()
      const rVersion = data.Depends?.R?.replace(/([<>=]+)\s+/g, '$1') || '*'
      return {
        subject: 'R',
        status: version(rVersion),
        color: versionColor(rVersion)
      }
    }
    case 'dependents': {
      const data = await client.get(`/-/revdeps/${pkg}`).json<any>()
      const dependents = Object.keys(data[pkg].Depends).length
      return {
        subject: 'dependents',
        status: millify(dependents),
        color: 'green'
      }
    }
  }
}

async function cranlogsHandler ({ topic, pkg }: PathArgs) {
  switch (topic) {
    case 'dt': {
      const downloads = await fetchDownloads(pkg, 'total')
      return {
        subject: 'downloads',
        status: millify(downloads),
        color: 'green'
      }
    }
    case 'dd': {
      const downloads = await fetchDownloads(pkg, 'last-day')
      return {
        subject: 'downloads',
        status: `${millify(downloads)}/day`,
        color: 'green'
      }
    }
    case 'dw': {
      const downloads = await fetchDownloads(pkg, 'last-week')
      return {
        subject: 'downloads',
        status: `${millify(downloads)}/week`,
        color: 'green'
      }
    }
    case 'dm': {
      const downloads = await fetchDownloads(pkg, 'last-month')
      return {
        subject: 'downloads',
        status: `${millify(downloads)}/month`,
        color: 'green'
      }
    }
  }
}

async function fetchDownloads (pkg: string, period: string) {
  const client = got.extend({ prefixUrl: CRANLOGS_API_URL })
  if (period === 'total') {
    const [start] = new Date(0).toISOString().split('T')
    const end = 'last-day'
    period = [start, end].join(':')
  }
  const [stats] = await client.get(`downloads/total/${period}/${pkg}`).json() as any
  return stats.downloads
}
