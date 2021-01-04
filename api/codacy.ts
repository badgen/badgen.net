import got from '../libs/got'
import { coverage as cov, coverageColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const CODACY_API_URL = 'https://api.codacy.com/'

const client = got.extend({ prefixUrl: CODACY_API_URL })

export default createBadgenHandler({
  title: 'Codacy',
  examples: {
    // f0875490cea1497a9eca9c25f3f7774e → https://github.com/xobotyi/react-scrollbars-custom
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e': 'coverage',
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch coverage',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e': 'code quality',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch code quality'
  },
  handlers: {
    '/codacy/:type<coverage|grade>/:projectId/:branch?': handler
  }
})

const COLORS_BY_GRADE = {
  A: '4ac41c',
  B: '98c510',
  C: '9fa126',
  D: 'd7b024',
  E: 'f17d3e',
  F: 'd7624b'
}

const SUBJECT_BY_TYPE = {
  coverage: 'coverage',
  grade: 'code quality'
}

async function handler ({ type, projectId, branch }: PathArgs) {
  const searchParams = new URLSearchParams()
  if (branch) searchParams.append('branch', branch.replace(/-/g, '--'))
  const endpoint = `project/badge/${type}/${projectId}`
  const svg = await client.get(endpoint, { searchParams }).text()

  const subject = SUBJECT_BY_TYPE[type] || 'codacy'
  const status = svg.match(/\/>\s*<text.*?>([^<]+)<\//i)?.[1].trim() ?? ''

  switch (type) {
    case 'coverage': {
      const percentage = parseFloat(status)
      if (Number.isNaN(percentage)) break
      return {
        subject,
        status: cov(percentage),
        color: coverageColor(percentage)
      }
    }
    case 'grade': {
      const color = COLORS_BY_GRADE[status]
      if (!color) break
      return {
        subject,
        status,
        color
      }
    }
  }

  return {
    subject,
    status: 'invalid',
    color: 'grey'
  }
}
