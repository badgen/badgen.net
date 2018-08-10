const axios = require('../axios.js')
const qs = require('querystring')

// https://circleci.com/docs/api/v1-reference/
module.exports = async (vcsType, username, project, branch) => {
  branch = branch ? `/tree/${qs.escape(branch)}` : ''
  const endpoint = `https://circleci.com/api/v1.1/project/${vcsType}/${username}/${project}${branch}`
  const [latest] = await axios.get(endpoint).then(res => res.data)

  return {
    subject: 'circleci',
    status: latest.status.replace(/_/g, ' '),
    color: getStatusColor(latest.status)
  }
}

const getStatusColor = status => {
  switch (status) {
    case 'infrastructure_fail':
    case 'timedout':
    case 'failed':
    case 'no_tests':
      return 'red'

    case 'canceled':
    case 'not_run':
    case 'not_running':
      return 'grey'

    case 'queued':
    case 'scheduled':
      return 'yellow'

    case 'retried':
    case 'running':
      return 'orange'

    case 'fixed':
    case 'success':
      return 'green'

    default:
      return 'grey'
  }
}
