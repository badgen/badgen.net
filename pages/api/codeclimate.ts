import got from '../../libs/got'
import { coverage as cov, scale } from '../../libs/utils'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'
import type { BadgenParams } from '../../libs/types'


const help = `
## Discontinued

CodeClimate has now been deprecated in favour of Qlty ([announcement](https://codeclimate.com/blog/code-climate-quality-is-now-qlty-software)).

Qlty now has an official badge service documented [here](https://docs.qlty.sh/coverage/status-badges).
`

export default createBadgenHandler({
  title: 'Code Climate',
  help,
  examples: {
    '/codeclimate/loc/codeclimate/codeclimate': 'lines of code',
    '/codeclimate/issues/codeclimate/codeclimate': 'issues',
    '/codeclimate/tech-debt/codeclimate/codeclimate': 'technical debt',
    '/codeclimate/maintainability/codeclimate/codeclimate': 'maintainability',
    '/codeclimate/maintainability-percentage/codeclimate/codeclimate': 'maintainability (percentage)',
    '/codeclimate/coverage/codeclimate/codeclimate': 'coverage',
    '/codeclimate/coverage-letter/codeclimate/codeclimate': 'coverage (letter)',
  },
  handlers: {
    '/codeclimate/:topic/:owner/:repo': handler
  }
})

async function handler ({ topic, owner, repo }: PathArgs): Promise<BadgenParams> {
  return {
    subject: 'codeclimate',
    status: 'discontinued',
    color: 'grey'
  }
}
