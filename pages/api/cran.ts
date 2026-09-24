import { requestJson } from '../../libs/http'
import { millify, version, versionColor } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

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
  const requestOptions = { baseUrl: CRAN_API_URL }

  switch (topic) {
    case 'v':
    case 'version': {
      const data = await requestJson<any>(pkg, requestOptions)
      return {
        subject: 'cran',
        status: version(data.Version),
        color: versionColor(data.Version)
      }
    }
    case 'license': {
      const data = await requestJson<any>(pkg, requestOptions)
      const license = data.License?.replace(/\s*\S\s+file\s+LICEN[CS]E$/i, '')
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
    case 'r': {
      const data = await requestJson<any>(pkg, requestOptions)
      const rVersion = data.Depends?.R?.replace(/([<>=]+)\s+/g, '$1') || '*'
      return {
        subject: 'R',
        status: version(rVersion),
        color: versionColor(rVersion)
      }
    }
    case 'dependents': {
      const data = await requestJson<any>(`/-/revdeps/${pkg}`, requestOptions)
      const dependents = Object.keys(data[pkg].Depends).length
      return {
        subject: 'dependents',
        status: millify(dependents),
        color: 'green'
      }
    }
  }

  return {
    subject: 'cran',
    status: 'unknown',
    color: 'grey'
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

  return {
    subject: 'downloads',
    status: 'unknown',
    color: 'grey'
  }
}

async function fetchDownloads (pkg: string, period: string) {
  const requestOptions = { baseUrl: CRANLOGS_API_URL }
  if (period === 'total') {
    const [start] = new Date(0).toISOString().split('T')
    const end = 'last-day'
    period = [start, end].join(':')
  }
  const [stats] = await requestJson(`downloads/total/${period}/${pkg}`, requestOptions) as any
  return stats.downloads
}
