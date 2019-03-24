const qs = require('querystring')
const got = require('../got.js')

// https://circleci.com/docs/api/v1-reference/
module.exports = async (vcsType, user, project, branch) => {
  branch = branch ? `/tree/${qs.escape(branch)}` : ''
  const endpoint = `https://circleci.com/api/v1.1/project/${vcsType}/${user}/${project}${branch}?filter=completed&limit=1`
  const [latest] = await got(endpoint).then(res => res.body)

  return {
    subject: 'circleci',
    status: latest.status.replace(/_/g, ' '),
    color: getStatusColor(latest.status)
  }
}

const getStatusColor = status => {
  switch (status) {
    case 'failed':
      return 'red'

    case 'success':
      return 'green'

    default:
      return 'grey'
  }
}
