import cheerio from 'cheerio'
import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Azure Piplines',
  examples: {
    '/azure-pipelines/yarnpkg/yarn/Yarn Acceptance Tests': 'build',
    '/azure-pipelines/yarnpkg/yarn/Yarn Acceptance Tests/azure-pipelines': 'build (branch)',
  },
  handlers: {
    '/azure-pipelines/:org/:project/:definition/:branch?': handler
  }
})

async function handler ({ org, project, definition, branch = 'master'}: PathArgs) {
  // @ts-ignore
  const response = await got(`https://dev.azure.com/${org}/${project}/_apis/build/status/${definition}?branchName=${branch}`, { json: false })
  const contentType = response.headers['content-type']

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
