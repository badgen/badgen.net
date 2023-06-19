import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const help = `
## Discontinued

Read all about GitHub [The next step for LGTM.com: GitHub code scanning!](https://github.blog/2022-08-15-the-next-step-for-lgtm-com-github-code-scanning/).
`

export default createBadgenHandler({
  title: 'LGTM',
  examples: {
    '/lgtm/langs/g/apache/cloudstack/java': 'langs',
    '/lgtm/alerts/g/apache/cloudstack': 'alerts',
    '/lgtm/lines/g/apache/cloudstack/java': 'lines (java)',
    '/lgtm/grade/g/apache/cloudstack/java': 'grade (java)',
    '/lgtm/grade/g/apache/cloudstack': 'grade (auto)',
    '/lgtm/grade/g/systemd/systemd': 'grade (auto)',
    '/lgtm/grade/bitbucket/wegtam/bitbucket-youtrack-broker': 'grade (auto)',
    '/lgtm/grade/gitlab/nekokatt/hikari': 'grade (auto)',
  },
  handlers: {
    '/lgtm/:topic<alerts|grade|lines|langs>/:provider<g|github|bitbucket|gitlab>/:owner/:name/:lang?': handler,
    '/lgtm/:topic<grade>/:lang/:provider<g|github|bitbucket|gitlab>/:owner/:name': handler,
  },
  help: help
})

async function handler ({ topic, provider, owner, name, lang }: PathArgs): Promise<any> {
  return {
    subject: 'lgtm',
    status: 'discontinued',
    color: 'grey'
  }
}
