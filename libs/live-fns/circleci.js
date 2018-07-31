const axios = require('../axios.js')
const qs = require('querystring')

// https://circleci.com/docs/api/v1-reference/
module.exports = async function (vcsType, username, project, branch) {
  branch = branch ? `/tree/${qs.escape(branch)}` : ''
  const endpoint = `https://circleci.com/api/v1.1/project/${vcsType}/${username}/${project}${branch}`
  const [ latest ] = await axios.get(endpoint).then(res => res.data)

  return {
    subject: 'circleci',
    status: latest.status.replace(/_/g, ' '),
    color: latest.status === 'success' ? 'green' : 'red'
  }
}
