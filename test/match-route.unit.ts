import tap from 'tap'
import matchRoute from '../libs/match-route'

const runTest = (t, route, suite) => {
  // @ts-ignore
  Object.entries(suite).forEach(([url, result]) => {
    t.strictSame(
      matchRoute(route, url),
      result,
      `test match ${url}`
    )
  })
  t.end()
}

const testRouteSimple = '/user/:id<\\d+>'
tap.test(testRouteSimple, t => {
  const suite = {
    '/user/eiyo': null,
    '/user/123': { id: '123' },
    '/user/123/': { id: '123' }
  }
  runTest(t, testRouteSimple, suite)
})

const testRouteMultiRegex = '/user/:id<\\d+>/:status?<active|inactive>'
tap.test(testRouteMultiRegex, t => {
  const suite = {
    '/user/eiyo': null,
    '/user/123': { id: '123' },
    '/user/123/active': { id: '123', status: 'active'},
    '/user/123/eiyo': null
  }
  runTest(t, testRouteMultiRegex, suite)
})

const testRoutePlusSegment = '/david/:topic/:user/:repo/:path+'
tap.test(testRoutePlusSegment, t => {
  const suite = {
    '/david/dep/babel/babel': null,
    '/david/dep/babel/babel/packages/babel-cli': {
      topic: 'dep',
      user: 'babel',
      repo: 'babel',
      path: '/packages/babel-cli'
    }
  }
  runTest(t, testRoutePlusSegment, suite)
})

const testRouteOptionalSegment= '/github/:topic<stars|forks>/:owner/:repo/:chanel?/:more?'
tap.test(testRouteOptionalSegment, t => {
  const suite = {
    '/github/stars/amio/': null,
    '/github/eiyou/amio/badgen': null,
    '/github/stars/amio/badgen': {
      topic: 'stars',
      owner: 'amio',
      repo: 'badgen'
    },
    '/github/stars/amio/badgen/master': {
      topic: 'stars',
      owner: 'amio',
      repo: 'badgen',
      chanel: 'master'
    },
    '/github/stars/amio/badgen/master/': {
      topic: 'stars',
      owner: 'amio',
      repo: 'badgen',
      chanel: 'master'
    },
    '/github/stars/amio/badgen/master/more': {
      topic: 'stars',
      owner: 'amio',
      repo: 'badgen',
      chanel: 'master',
      more: 'more'
    },
  }
  runTest(t, testRouteOptionalSegment, suite)
})
