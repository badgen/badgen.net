const millify = require('millify')

// Use axios directly as the default Accept header breaks lgtm API
const axios = require('axios')

module.exports = async (topic, ...args) => {
  const lang = topic === 'grade' ? args.shift() : undefined
  const projectId = args.join('/')
  const endpoint = `https://lgtm.com/api/v0.1/project/${projectId}/details`
  const data = await axios.create({
    timeout: 3200
  }).get(endpoint).then(res => res.data)

  switch (topic) {
    case 'alerts':
      return alertsBadge(data)
    case 'grade':
      return gradeBadge(data, lang)
  }
}

const alertsBadge = (data) => (
  {
    subject: 'lgtm',
    status: `${millify(data.alerts)} alert${(data.alerts === 1 ? '' : 's')}`,
    color: data.alerts === 0 ? 'green' : 'yellow'
  }
)

const gradeBadge = (data, lang) => {
  for (const languageData of data.languages) {
    if (languageData.lang === lang && 'grade' in languageData) {
      const langLabel = langLabelOverrides[lang] || lang
      return {
        subject: `code quality: ${langLabel}`,
        status: languageData.grade,
        color: gradeColors[languageData.grade] || 'red'
      }
    }
  }
}

const langLabelOverrides = {
  cpp: 'c/c++',
  csharp: 'c#',
  javascript: 'js/ts'
}

const gradeColors = {
  'A+': 'green',
  'A': '9C0',
  'B': 'A4A61D',
  'C': 'yellow',
  'D': 'orange'
}
