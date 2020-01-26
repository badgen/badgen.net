import got from '../libs/got'
import cheerio from 'cheerio'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Azure Piplines',
  examples: {
    '/azure-pipelines/build/status/yarnpkg/yarn/1': 'build status',
    '/azure-pipelines/build/version/yarnpkg/yarn/1': 'build version',
    '/azure-pipelines/yarnpkg/yarn/1': 'build status (def-id)',
    '/azure-pipelines/yarnpkg/yarn/Yarn%20Acceptance%20Tests': 'build status (def-name)'
  },
  handlers: {
    '/azure-pipelines/build/status/:org/:project/:definition/:branch?': buildStatus,
    '/azure-pipelines/build/version/:org/:project/:definition/:branch?': buildVersion,
    '/azure-pipelines/build/test/:org/:project/:definition/:branch?': buildTestResult,
    '/azure-pipelines/release/version/:org/:project/:definition?': releaseVersion,
    '/azure-pipelines/deployment/version/:org/:project/:definition/:environment?': deployedReleaseVersion,
    '/azure-pipelines/:org/:project/:definition/:branch?': handler,
  },
  help: `
  ## Find Azure Pipeline config

  Take [https://dev.azure.com/yarnpkg/yarn/_build](https://dev.azure.com/yarnpkg/yarn/_build) as an example:

  - organization: \`yarnpkg\`
  - project: \`yarn\`
  - definition-id: \`1\`
  - definition-name: \`Yarn Acceptance Tests\`
  `
})

const colors = {
  'succeeded': 'green',
  'partially succeeded': 'yellow',
  'partiallySucceeded': 'yellow',
  'failed': 'red'
}
const statuses = {
  'succeeded': 'succeeded',
  'partiallySucceeded': 'partially succeeded',
  'failed': 'failed'
}

const getApiVersion = (preview: boolean) => preview ? '5.1-preview' : '5.1'

const azureDevOpsApiResponse = async (org: string, project: string, path: string, release: boolean = false) => {
  const prefix = release ? 'vsrm.' : ''
  return await got.get(`https://${prefix}dev.azure.com/${org}/${project}/_apis/${path}`).json<any>()
}

async function getLatestBuild ({ org, project, definition, branch = 'master'}: PathArgs) {
  const builds = await azureDevOpsApiResponse(org, project, `build/builds?api-version=${getApiVersion(false)}&branchName=refs/heads/${branch}&definitions=${definition}&$top=1`)
  return builds.value[0] || {}
}

async function getLatestRelease ({ org, project, definition}: PathArgs) {
  return await azureDevOpsApiResponse(org, project, `release/releases?api-version=${getApiVersion(true)}&definitionId=${definition}&$top=1`, true)
}

async function getDeployedRelease ({ org, project, definition, environment}: PathArgs) {
  return await azureDevOpsApiResponse(org, project, `release/deployments?api-version=${getApiVersion(true)}&definitionId=${definition}&$top=1&deploymentStatus=succeeded&definitionEnvironmentId=${environment}`, true)
}

async function getTestResultByBuild ({ org, project, build, minLastUpdatedDate, maxLastUpdatedDate}: PathArgs) {
  return await azureDevOpsApiResponse(org, project, `test/runs?api-version=${getApiVersion(true)}&$top=1&buildIds=${build}&minLastUpdatedDate=${minLastUpdatedDate}&maxLastUpdatedDate=${maxLastUpdatedDate}`)
}

async function buildStatus ({ org, project, definition, branch = 'master'}: PathArgs) {
  const response = await getLatestBuild({org, project, definition, branch})
  const status = statuses[response.result] || 'not found'
  const color = colors[response.result] || 'grey'
  return {
    subject: 'Build',
    status,
    color
  }
}

async function buildVersion ({ org, project, definition, branch = 'master'}: PathArgs) {
  const response = await getLatestBuild({org, project, definition, branch})
  const version = response.buildNumber || 'not found'
  const color = colors[response.result] || 'grey'
  return {
    subject: 'Build Version',
    status: version,
    color
  }
}

async function buildTestResult ({ org, project, definition, branch = 'master'}: PathArgs) {
  const build = await getLatestBuild({org, project, definition, branch})
  const testResult = await getTestResultByBuild({org, project, build: build.id, minLastUpdatedDate: build.startTime, maxLastUpdatedDate: build.finishTime})
  const runStatistics = testResult.value[0].runStatistics
  const total: number = testResult.value[0].totalTests
  const passed: {outcome: string, count: number} = runStatistics.find( (value: { outcome: string; }) => value.outcome === 'Passed')
  const notExecuted: {outcome: string, count: number} = runStatistics.find( (value: { outcome: string; }) => value.outcome === 'NotExecuted')
  const failed: {outcome: string, count: number} = runStatistics.find( (value: { outcome: string; }) => value.outcome === 'Failed')

  const passedCount = passed?.count ?? 0
  const notExecutedCount = notExecuted?.count ?? 0
  const failedCount =  failed?.count ?? total - passedCount - notExecutedCount

  const status = total == passedCount ? 'succeeded' : total == failedCount ? 'failed' : 'partially succeeded'
  const color = colors[status]
  return {
    subject: 'Test',
    status: `passed: ${passedCount}, failed: ${failedCount}, ignored: ${notExecutedCount}`,
    color
  }
}

async function releaseVersion ({ org, project, definition}: PathArgs) {
  const response = await getLatestRelease({org, project, definition})
  const status = response.value[0].name
  const color = colors['succeeded']
  return {
    subject: 'Release Version',
    status,
    color
  }
}

async function deployedReleaseVersion ({ org, project, definition, environment}: PathArgs) {
  const response = await getDeployedRelease({org, project, definition, environment})
  const status = response.value[0].release.name
  const color = colors['succeeded']
  return {
    subject: 'Deployed Version',
    status,
    color
  }
}

async function handler ({ org, project, definition, branch = 'master'}: PathArgs) {
  const response = await got(`https://dev.azure.com/${org}/${project}/_apis/build/status/${definition}?branchName=${branch}`)
  const contentType = response.headers['content-type'] || ''

  if (!contentType.includes('image/svg+xml')) {
    return {
      subject: 'Azure Pipelines',
      status: 'unknown',
      color: 'grey'
    }
  }

  const $ = cheerio.load(response.body)
  const status = $('g[font-family] > text:nth-child(3)').text()
  const color = {
    'succeeded': 'green',
    'partially succeeded': 'yellow',
    'failed': 'red'
  }[status]

  return {
    subject: 'Azure Pipelines',
    status,
    color
  }
}
