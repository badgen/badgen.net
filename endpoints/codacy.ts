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
    '/codacy/c/f0875490cea1497a9eca9c25f3f7774e': 'coverage',
    '/codacy/c/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch coverage',
    '/codacy/g/f0875490cea1497a9eca9c25f3f7774e': 'code quality',
    '/codacy/g/f0875490cea1497a9eca9c25f3f7774e/dev-master': 'branch code quality'
  }
}

export const handlers: Handlers = {
  '/codacy/:type<c|g>/:projectId/:branch?': handler
}

export default badgenServe(handlers)

const uriBase = 'https://api.codacy.com/project/badge'

const coveragePercentageMatchRegex = /([\d]+(?:\.[\d]+)?)%\s*<\/text>/
const gradeMatchRegex = /([ABCDEF])\s*<\/text>/
const gradeColors = {
  A: '4ac41c',
  B: '98c510',
  C: '9fa126',
  D: 'd7b024',
  E: 'f17d3e',
  F: 'd7624b'
}

async function handler ({ type, projectId, branch }: Args) {
  if (projectId) {
    if (type === 'c') {
      const svg = await got(`${uriBase}/coverage/${projectId}${branch ? '?branch=' + branch.replace('-', '--') : ''}`,
        // @ts-ignore
        { json: false })
        .then(({ body }) => body)

      if (svg) {
        const percentage = svg.match(coveragePercentageMatchRegex)[1] || null

        if (percentage !== null) {
          return {
            subject: 'coverage',
            status: cov(percentage),
            color: coverageColor(Number(percentage))
          }
        }
      }

      return {
        subject: 'coverage',
        status: 'invalid',
        color: 'grey'
      }
    } else if (type === 'g') {
      const svg = await got(`${uriBase}/grade/${projectId}${branch ? '?branch=' + branch.replace('-', '--') : ''}`,
        // @ts-ignore
        { json: false })
        .then(({ body }) => body)

      if (svg) {
        const grade = svg.match(gradeMatchRegex)[1] || null

        if (grade !== null) {
          return {
            subject: 'code quality',
            status: grade,
            color: gradeColors[grade]
          }
        }
      }

      return {
        subject: 'code quality',
        status: 'invalid',
        color: 'grey'
      }
    }
  }

  return {
    subject: 'codacy',
    status: 'unknown',
    color: 'grey'
  }
}
