import got from '../libs/got'
import { coverage as cov, coverageColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Codacy',
  examples: {
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e': 'coverage',
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch coverage',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e': 'code quality',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch code quality'
  },
  handlers: {
    '/codacy/:type<coverage|grade>/:projectId/:branch?': handler
  }
})

const uriBase = 'https://api.codacy.com/project/badge'

const COVERAGE_PERCENTAGE_REGEX = />\s*([\d]+(?:\.[\d]+)?)%\s*<\/text>/
const GRADE_REGEX = />\s*([ABCDEF])\s*<\/text>/

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

async function handler ({ type, projectId, branch = 'master' }: PathArgs) {
  if (projectId) {
    const svg = await got(`${uriBase}/${type}/${projectId}`,{
      searchParams: { branch: branch && branch.replace('-', '--') }
    }).text() || ''

    const subject = SUBJECT_BY_TYPE[type] || 'codacy'

    if (svg) {
      if (type === 'coverage') {
        const percentage = svg.match(COVERAGE_PERCENTAGE_REGEX)?.[1]

        if (percentage !== null) {
          return {
            subject,
            status: cov(percentage),
            color: coverageColor(Number(percentage))
          }
        }
      } else if (type === 'grade') {
        const grade = svg.match(GRADE_REGEX)?.[1] ?? ''

        return {
          subject,
          status: grade,
          color: COLORS_BY_GRADE[grade] || 'grey'
        }
      }
    }

    return {
      subject,
      status: 'invalid',
      color: 'grey'
    }
  }
}
