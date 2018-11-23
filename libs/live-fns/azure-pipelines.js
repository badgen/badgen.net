const got = require('../got.js')
const cheerio = require('cheerio')

module.exports = async (organization, project, definition, branch = 'master') => {
  const response = await got(`https://dev.azure.com/${organization}/${project}/_apis/build/status/${definition}?branchName=${branch}`, { json: false })
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
