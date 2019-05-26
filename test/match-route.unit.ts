import matchRoute from '../libs/match-route'

const matcher = route => path => {
  const result = matchRoute(route, path)
  console.log(route, '\n<=', path, '\n=>', result, '\n')
  return result
}

const route = '/github/:topic<stars|forks>/:owner/:repo/:chanel?/:more?'
const parsed = [
  '/github/stars/amio/',
  '/github/eiyou/amio/badgen',
  '/github/stars/amio/badgen',
  '/github/stars/amio/badgen',
  '/github/stars/amio/badgen/master',
  '/github/stars/amio/badgen/master/',
  '/github/stars/amio/badgen/master/more',
].map(matcher(route))

const route2 = '/user/:id<\\d+>'
const parsed2 = [
  '/user/123',
  '/user/eiyo'
].map(matcher(route2))

const route3 = '/usr/:id<\\d+>/:status?<active|inactive>'
const parsed3 = [
  '/usr/123',
  '/usr/123/active',
  '/usr/123/eiyo'
].map(matcher(route3))
