import got from '../libs/got'
import { coverage as cov, scale } from '../libs/utils'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Code Climate',
  examples: {
    '/codeclimate/loc/codeclimate/codeclimate': 'lines of code',
    '/codeclimate/issues/codeclimate/codeclimate': 'issues',
    '/codeclimate/tech-debt/codeclimate/codeclimate': 'technical debt',
    '/codeclimate/maintainability/codeclimate/codeclimate': 'maintainability',
    '/codeclimate/maintainability-percentage/codeclimate/codeclimate': 'maintainability (percentage)',
    '/codeclimate/coverage/codeclimate/codeclimate': 'coverage',
    '/codeclimate/coverage-letter/codeclimate/codeclimate': 'coverage (letter)',
  }
}

export const handlers: Handlers = {
  '/codeclimate/:topic/:owner/:repo': handler
}

export default badgenServe(handlers)

async function handler ({ topic, owner, repo }: Args) {
  const api = `https://api.codeclimate.com/v1/repos?github_slug=${owner}/${repo}`
  const meta = await got(api).then(res => res.body.data[0])

  if (!meta) {
    return {
      subject: 'codeclimate',
      status: 'not found',
      color: 'grey'
    }
  }

  const testReport = meta.relationships.latest_default_branch_test_report.data
  const snapReport = meta.relationships.latest_default_branch_snapshot.data

  switch (topic) {
    case 'loc':
    case 'issues':
    case 'tech-debt':
    case 'maintainability':
    case 'maintainability-percentage':
      return getReport(meta.id, snapReport.id, 'snapshots', topic)
    case 'coverage-letter':
    case 'coverage':
      if (!testReport) return {
        subject: 'codeclimate',
        status: 'no test',
        color: 'grey'
      }
      return getReport(meta.id, testReport.id, 'test_reports', topic)
    default:
      return {
        subject: 'codeclimate',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

const getReport = async (repoId, reportId, type, topic) => {
  const api = `https://api.codeclimate.com/v1/repos/${repoId}/${type}/${reportId}`
  const { meta, attributes } = await got(api).then(res => res.body.data)

  switch (topic) {
    case 'issues':
      return {
        subject: 'issues',
        status: meta.issues_count,
        color: 'blue'
      }
    case 'tech-debt':
      return {
        subject: 'technical debt',
        status: meta.measures.technical_debt_ratio.value.toFixed() + '%',
        color: debtColors(meta.measures.technical_debt_ratio.value)
      }
    case 'loc':
      return {
        subject: 'lines of code',
        status: attributes.lines_of_code,
        color: 'blue'
      }
    case 'maintainability':
      return {
        subject: 'maintainability',
        status: attributes.ratings[0].letter,
        color: gradeColors[attributes.ratings[0].letter] || 'red'
      }
    case 'maintainability-percentage':
      return {
        subject: 'maintainability',
        status: attributes.ratings[0].measure.value.toFixed() + '%',
        color: gradeColors[attributes.ratings[0].letter] || 'red'
      }
    case 'coverage-letter':
      return {
        subject: 'coverage',
        status: attributes.rating.letter,
        color: scale('coverage')(attributes.rating.measure.value)
      }
    case 'coverage':
      return {
        subject: 'coverage',
        status: cov(attributes.rating.measure.value),
        color: scale('coverage')(attributes.rating.measure.value)
      }
  }
}

const debtColors = scale(
  [5, 10, 20, 50],
  ['green', '9C1', 'EA2', 'orange', 'red']
)

const gradeColors = {
  'A': 'green',
  'B': '9C0',
  'C': 'AA2',
  'D': 'DC2',
  'E': 'orange'
}
