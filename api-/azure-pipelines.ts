import got from '../libs/got'
import { isBadge, millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Azure Piplines',
  examples: {
    '/azure-pipelines/dnceng/public/efcore-ci': 'pipeline status (definition name)',
    '/azure-pipelines/dnceng/public/51': 'pipeline status (definition id)',
    '/azure-pipelines/build/status/dnceng/public/51': 'build status',
    '/azure-pipelines/build/version/dnceng/public/51': 'build version',
    '/azure-pipelines/build/test/dnceng/public/51': 'test results',
    '/azure-pipelines/build/test/azuredevops-powershell/azuredevops-powershell/1': 'test results',
    '/azure-pipelines/release/version/azuredevops-powershell/azuredevops-powershell/1': 'release version',
    '/azure-pipelines/deployment/version/azuredevops-powershell/azuredevops-powershell/1': 'deployment version',
  },
  handlers: {
    '/azure-pipelines/build/status/:org/:project/:definition-id<\\d+>/:branch?': buildStatus,
    '/azure-pipelines/build/version/:org/:project/:definition-id<\\d+>/:branch?': buildVersion,
    '/azure-pipelines/build/test/:org/:project/:definition-id<\\d+>/:branch?': buildTestResult,
    '/azure-pipelines/release/version/:org/:project/:definition-id<\\d+>/:environment-id?<\\d+>': releaseVersion,
    '/azure-pipelines/deployment/version/:org/:project/:definition-id<\\d+>/:environment-id?<\\d+>': deploymentVersion,
    '/azure-pipelines/:org/:project/:definition/:branch?': handler,
  },
  help: `
  ## Find Azure Pipeline config

  Take [Entity Framework Core](https://dev.azure.com/dnceng/public/_build?definitionId=51) as an example:

  - organization: \`dnceng\`
  - project: \`public\`
  - definition-id: \`51\`
  - definition-name: \`efcore-ci\`
  `
})

const colors = {
  succeeded: 'green',
  partiallySucceeded: 'yellow',
  failed: 'red'
}
const statuses = {
  succeeded: 'succeeded',
  partiallySucceeded: 'partially succeeded',
  failed: 'failed'
}

function createClient(org: string, project: string, { release = false } = {}) {
  const prefix = release ? 'vsrm.' : ''
  const prefixUrl = `https://${prefix}dev.azure.com/${org}/${project}/_apis/`
  return got.extend({ prefixUrl })
}

// https://docs.microsoft.com/en-us/rest/api/azure/devops/build/builds/list
// https://github.com/microsoft/azure-devops-extension-api/blob/v1.157.0/src/Build/BuildClient.ts#L436-L516
async function getLatestBuild ({ org, project, 'definition-id': definition, branch }: PathArgs) {
  const client = createClient(org, project)
  const searchParams = new URLSearchParams({
    'api-version': '6.0',
    '$top': '1',
    definitions: definition,
    statusFilter: 'completed'
  })
  if (branch) searchParams.set('branchName', `refs/heads/${branch}`)
  const builds = await client.get('build/builds', { searchParams }).json<any>()
  return builds.value[0] || {}
}

// https://docs.microsoft.com/en-us/rest/api/azure/devops/release/releases/list
// https://github.com/microsoft/azure-devops-extension-api/blob/v1.157.0/src/Release/ReleaseClient.ts#L1511-L1594
async function getLatestRelease ({ org, project, 'definition-id': definition, 'environment-id': environment }: PathArgs) {
  const client = createClient(org, project, { release: true })
  const searchParams = new URLSearchParams({
    'api-version': '6.0',
    '$top': '1',
    definitionId: definition
  })
  if (environment) searchParams.set('definitionEnvironmentId', environment)
  const releases = await client.get('release/releases', { searchParams }).json<any>()
  return releases.value[0] || {}
}

// https://docs.microsoft.com/en-us/rest/api/azure/devops/release/deployments/list
// https://github.com/microsoft/azure-devops-extension-api/blob/v1.157.0/src/Release/ReleaseClient.ts#L666-L729
async function getLatestDeployment ({ org, project, 'definition-id': definition, 'environment-id': environment }: PathArgs) {
  const client = createClient(org, project, { release: true })
  const searchParams = new URLSearchParams({
    'api-version': '6.0',
    '$top': '1',
    definitionId: definition,
    deploymentStatus: 'succedeed'
  })
  if (environment) searchParams.set('definitionEnvironmentId', 'environment')
  const deployments = await client.get('release/deployments', { searchParams }).json<any>()
  return deployments.value[0] || {}
}

// https://github.com/microsoft/azure-devops-extension-api/blob/v1.157.0/src/Test/TestClient.ts#L1360-L1390
async function getTestResultByBuild ({ org, project, build }: PathArgs) {
  const client = createClient(org, project)
  const searchParams = {
    'api-version': '6.0-preview',
    buildId: build
  }
  const result = await client.get('test/ResultSummaryByBuild', { searchParams }).json<any>()
  return result.aggregatedResultsAnalysis || {}
}

async function buildStatus (args: PathArgs) {
  const { result: status } = await getLatestBuild(args)
  return {
    subject: 'Build',
    status: statuses[status] || 'not found',
    color: colors[status] || 'grey'
  }
}

async function buildVersion (args: PathArgs) {
  const { buildNumber, result: status } = await getLatestBuild(args)
  return {
    subject: 'Build Version',
    status: buildNumber || 'not found',
    color: colors[status] || 'grey'
  }
}

async function buildTestResult (args: PathArgs) {
  const { org, project, build = await getLatestBuild(args) } = args
  const { resultsByOutcome, totalTests } = await getTestResultByBuild({ org, project, build: build.id })

  const passed = resultsByOutcome.Passed?.count ?? 0
  const failed = resultsByOutcome.Failed?.count ?? 0
  const ignored = resultsByOutcome.NotExecuted?.count ?? totalTests - passed - failed

  const status = [
    passed && `${millify(passed)} passed`,
    failed && `${millify(failed)} failed`,
    ignored && `${millify(ignored)} skipped`
  ].filter(Boolean).join(', ')

  const color = totalTests === passed
    ? colors.succeeded
    : totalTests === failed
    ? colors.failed
    : colors.partiallySucceeded

  return {
    subject: 'Test',
    status,
    color
  }
}

async function releaseVersion (args: PathArgs) {
  const release = await getLatestRelease(args)
  return {
    subject: 'Release Version',
    status: release.name || 'not found',
    color: release.name ? 'green' : 'grey'
  }
}

async function deploymentVersion (args: PathArgs) {
  const { release, deploymentStatus: status } = await getLatestDeployment(args)
  return {
    subject: 'Deployment Version',
    status: release?.name || 'not found',
    color: colors[status] || 'grey'
  }
}

async function handler ({ org, project, definition, branch }: PathArgs) {
  const searchParams = new URLSearchParams()
  if (branch) searchParams.set('branchName', branch)
  const endpoint =`https://dev.azure.com/${org}/${project}/_apis/build/status/${definition}`
  const resp = await got(endpoint, { searchParams })
  const params = isBadge(resp) && parseBadge(resp.body)
  return params || {
    subject: 'Azure Pipelines',
    status: 'unknown',
    color: 'grey'
  }
}

function parseBadge(svg: string) {
  const [subject, status] = [...svg.matchAll(/fill-opacity=[^>]*?>([^<]+)<\//ig)]
    .map(match => match[1].trim())
  const color = svg.match(/<rect[^>]*?fill="([^"]+)"[^>]*?x=/i)?.[1]
    .trim().replace(/^#/, '')

  if (!status || !color) return
  return {
    subject: subject || 'Azure Pipelines',
    status,
    color
  }
}
