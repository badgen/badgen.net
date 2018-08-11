const got = require('../got.js')
const scale = require('../utils/scale.js')

module.exports = async (topic, user, repo) => {
  const api = `https://api.codeclimate.com/v1/repos?github_slug=${user}/${repo}`
  const meta = await got(api).then(res => res.body.data[0])

  if (!meta) {
    return {
      status: 'not found'
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
      if (!testReport) return { status: 'no test' }
      return getReport(meta.id, testReport.id, 'test_reports', topic)
    default:
      return {}
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
        subject: 'maintainbality',
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
        status: attributes.rating.measure.value + '%',
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
