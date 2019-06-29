import {
  badgenServe,
  BadgenServeHandlerArgs as Args,
  BadgenServeHandlers as Handlers,
  BadgenServeMeta as Meta
} from '../libs/badgen-serve'
// import { coverage as cov, coverageColor } from '../libs/utils'
import got from '../libs/got'
import { coverage as cov, coverageColor } from '../libs/utils'

export const meta: Meta = {
  title: 'Codacy',
  examples: {
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e': 'coverage',
    '/codacy/coverage/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch coverage',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e': 'code quality',
    '/codacy/grade/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch code quality'
  }
}

export const handlers: Handlers = {
  '/codacy/:type<coverage|grade>/:projectId/:branch?': handler
}

export default badgenServe(handlers)

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

async function handler ({ type, projectId, branch }: Args) {
  if (projectId) {
    const svg = await got(`${uriBase}/${type}/${projectId}`,
      // @ts-ignore
      { query: { branch: branch && branch.replace('-', '--') }, json: false })
      .then(({ body }) => body)

    const subject = SUBJECT_BY_TYPE[type] || 'codacy'

    if (svg) {
      if (type === 'coverage') {
        const percentage = svg.match(COVERAGE_PERCENTAGE_REGEX)[1] || null

        if (percentage !== null) {
          return {
            subject,
            status: cov(percentage),
            color: coverageColor(Number(percentage))
          }
        }
      } else if (type === 'grade') {
        const grade = svg.match(GRADE_REGEX)[1] || null

        return {
          subject,
          status: grade,
          color: COLORS_BY_GRADE[grade]
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
