import got from '../libs/got'
import { millify } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const BRAND_COLOR = 'FF4500'

const client = got.extend({ prefixUrl: 'https://www.reddit.com' })

export default createBadgenHandler({
  title: 'Reddit',
  examples: {
    '/reddit/karma/u/spez': 'karma',
    '/reddit/post-karma/u/spez': 'post karma',
    '/reddit/comment-karma/u/spez': 'comment karma',
    '/reddit/subscribers/r/programming': 'subreddit subscribers'
  },
  handlers: {
    '/reddit/:topic<karma|comment-karma|post-karma>/u/:user': karmaHandler,
    '/reddit/:topic<karma|comment-karma|post-karma>/:user': karmaHandler,
    '/reddit/subscribers/r/:subreddit': subscribersHandler,
    '/reddit/subscribers/:subreddit': subscribersHandler
  }
})

async function karmaHandler ({ topic, user }: PathArgs) {
  // https://www.reddit.com/dev/api/#GET_user_{username}_about
  const { data } = await client.get(`user/${user}/about.json`).json<any>()

  switch (topic) {
    case 'karma':
      return {
        subject: `u/${user}`,
        status: `${millify(data.total_karma)} karma`,
        color: BRAND_COLOR
      }
    case 'comment-karma':
      return {
        subject: `u/${user}`,
        status: `${millify(data.comment_karma)} comment karma`,
        color: BRAND_COLOR
      }
    case 'post-karma':
      return {
        subject: `u/${user}`,
        status: `${millify(data.link_karma)} post karma`,
        color: BRAND_COLOR
      }
  }
}

async function subscribersHandler ({ subreddit }: PathArgs) {
  subreddit = `r/${subreddit}`
  // https://www.reddit.com/dev/api/#GET_r_{subreddit}_about
  const { data } = await client.get(`${subreddit}/about.json`).json<any>()
  return {
    subject: subreddit,
    status: `${millify(data.subscribers)} subscribers`,
    color: BRAND_COLOR
  }
}
