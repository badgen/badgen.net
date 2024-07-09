import got from '../libs/got'
import { isBadge, coverage as cov, coverageColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const CODACY_API_URL = 'https://api.codacy.com/'

const client = got.extend({ prefixUrl: CODACY_API_URL })

export default createBadgenHandler({
  title: 'Codacy',
  examples: {
    // f0875490cea1497a9eca9c25f3f7774e → https://github.com/xobotyi/react-scrollbars-custom
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e': 'coverage',
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e/master': 'branch coverage',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e': 'code quality',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e/master': 'branch code quality'
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
  if (branch) searchParams.set('branch', branch)
  const endpoint = `project/badge/${type}/${projectId}`
  const resp = await client.get(endpoint, { searchParams })
  const params = isBadge(resp) && parseBadge(resp.body, type)
  return params || {
    subject: 'codacy',
    status: 'unknown',
    color: 'grey'
  }
}

function parseBadge(svg: string, type: string) {
  const subject = SUBJECT_BY_TYPE[type]
  switch (type) {
    case 'coverage': {
      const status = svg.match(/text-anchor=[^>]*?>([^<]+)<\//i)?.[1].trim() ?? ''
      const percentage = parseFloat(status)
      if (Number.isNaN(percentage)) return
      return {
        subject: subject || 'codacy',
        status: cov(percentage),
        color: coverageColor(percentage)
      }
    }
    case 'grade': {
      const status = svg.match(/visibility=[^>]*?>([^<]+)<\//i)?.[1].trim() ?? ''
      const color = COLORS_BY_GRADE[status]
      if (!status || !color) return
      return {
        subject: subject || 'codacy',
        status,
        color
      }
    }
  }
}
