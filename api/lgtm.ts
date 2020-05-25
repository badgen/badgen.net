import millify from 'millify'
import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

// https://lgtm.com/help/lgtm/api/api-v1
const LGTM_API_URL = 'https://lgtm.com/api/v1.0/'

const client = got.extend({ prefixUrl: LGTM_API_URL })

export default createBadgenHandler({
  title: 'LGTM',
  examples: {
    '/lgtm/langs/g/apache/cloudstack/java': 'langs',
    '/lgtm/alerts/g/apache/cloudstack': 'alerts',
    '/lgtm/lines/g/apache/cloudstack/java': 'lines (java)',
    '/lgtm/grade/g/apache/cloudstack/java': 'grade (java)',
    '/lgtm/grade/g/apache/cloudstack': 'grade (auto)',
    '/lgtm/grade/g/systemd/systemd': 'grade (auto)',
    '/lgtm/grade/b/wegtam/bitbucket-youtrack-broker': 'grade (auto)',
    '/lgtm/grade/gl/nekokatt/hikari': 'grade (auto)',
  },
  handlers: {
    '/lgtm/:topic<alerts|grade|lines|langs>/:provider<g|b|gl>/:owner/:name/:lang?': handler,
    '/lgtm/:topic<grade>/:lang/:provider<g|b|gl>/:owner/:name': handler, // deprecated
  }
})

async function handler ({ topic, provider, owner, name, lang }: PathArgs) {
  // https://lgtm.com/help/lgtm/api/api-v1#LGTM-API-specification-Projects
  const data = await client.get(`projects/${provider}/${owner}/${name}`).json<any>()
  const { language, alerts, lines, grade } = detailsByLang(data, lang)
  const langLabel = langLabelOverrides[language] || language

  switch (topic) {
    case 'alerts':
      return {
        subject: `alerts: ${langLabel}`,
        status: millify(alerts),
        color: alerts === 0 ? 'green' : 'yellow'
      }
    case 'grade':
      return {
        subject: `code quality: ${langLabel}`,
        status: grade,
        color: gradeColors[grade] || 'grey'
      }
    case 'lines':
      const showLines = lang ? lines : data.languages.reduce((accu, curr) => {
        return accu + curr.lines
      }, 0)
      return {
        subject: lang ? `lines: ${langLabel}` : 'lines',
        status: millify(showLines),
        color: 'blue'
      }
    case 'langs':
      const langs = data.languages
        .sort((a, b) => b.lines - a.lines)
        .map(x => langLabelOverrides[x.language] || x.language)
        .join(' | ')
      return {
        subject: 'languages',
        status: langs,
        color: 'blue'
      }
  }
}

const detailsByLang = (data, lang) => {
  const found = lang && data.languages.find(x => x.language === lang)

  if (found) {
    return found
  } else {
    // find main lang with most sloc
    return data.languages.reduce((accu, curr) => {
      return curr.lines > accu.lines ? curr : accu
    })
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
