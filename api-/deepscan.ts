import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const last = (arr: any[]): any => arr[arr.length - 1]
const isObject = (input: any): boolean => input !== null && typeof input === 'object'
const hasProp = (input: any, prop: string): boolean => Object.prototype.hasOwnProperty.call(input, prop)

const DEEPSCAN_API_URL = 'https://deepscan.io/api/'

const client = got.extend({ prefixUrl: DEEPSCAN_API_URL })

const gradeColors = {
  'none': 'cecece',
  'good': '89b414',
  'normal': '2148b1',
  'poor': 'ff5a00'
}

export default createBadgenHandler({
  title: 'DeepScan',
  examples: {
    // https://deepscan.io/dashboard/#view=project&tid=7382&pid=9494&bid=123838&subview=overview
    '/deepscan/grade/team/7382/project/9494/branch/123838': 'grade',
    // https://deepscan.io/dashboard/#view=project&tid=279&pid=1302&bid=3514&subview=overview
    '/deepscan/grade/team/279/project/1302/branch/3514': 'grade',
    // https://deepscan.io/dashboard/#view=project&tid=8527&pid=10741&bid=152550&subview=overview
    '/deepscan/grade/team/8527/project/10741/branch/152550': 'grade',
    // https://deepscan.io/dashboard/#view=project&tid=8527&pid=10741&bid=152550&subview=overview
    '/deepscan/issues/team/8527/project/10741/branch/152550': 'issues',
    // https://deepscan.io/dashboard/#view=project&tid=7382&pid=9494&bid=123838&subview=overview
    '/deepscan/issues/team/7382/project/9494/branch/123838': 'issues',
    // https://deepscan.io/dashboard/#view=project&tid=8527&pid=10741&bid=152550&subview=overview
    '/deepscan/lines/team/8527/project/10741/branch/152550': 'lines',
    // https://deepscan.io/dashboard/#view=project&tid=7382&pid=9494&bid=123838&subview=overview
    '/deepscan/lines/team/7382/project/9494/branch/123838': 'lines'
  },
  handlers: {
    '/deepscan/:topic<grade|issues|lines>/team/:teamId/project/:projectId/branch/:branchId': handler
  }
})

async function handler ({ topic, teamId, projectId, branchId }: PathArgs) {
  const endpoint = `teams/${teamId}/projects/${projectId}/branches/${branchId}/analyses`
  const resp = await client.get(endpoint).json<any>()
  const result = last(resp.data)

  switch (topic) {
    case 'grade': {
      const grade = result?.grade.toLowerCase()
      return {
        subject: 'deepscan',
        status: grade || 'unknown',
        color: gradeColors[grade] || 'grey'
      }
    }
    case 'issues': {
      const params = {
        subject: 'issues',
        status: 'unknown',
        color: 'gray'
      }
      if (isObject(result) && hasProp(result, 'outstandingDefectCount')) {
        params.status = millify(result.outstandingDefectCount)
        params.color = result.outstandingDefectCount === 0 ? 'green' : 'yellow'
      }
      return params
    }
    case 'lines': {
      const params = {
        subject: 'lines',
        status: 'unknown',
        color: 'gray'
      }
      if (isObject(result) && hasProp(result, 'loc')) {
        params.status = millify(result.loc)
        params.color = 'blue'
      }
      return params
    }
  }
}
