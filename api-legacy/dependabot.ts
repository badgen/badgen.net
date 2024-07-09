import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const help = `
## Public repositories

To enable dependabot on a public repo (for the badge to working), you need to either

- login at https://app.dependabot.com/ then add it manually,
- or add a [\`.dependabot/config.yml\`](https://dependabot.com/docs/config-file/) file to the repo.

Then you may include the badge in your repo like [this PR](https://github.com/thepracticaldev/dev.to/pull/3268).

## Private repositories
In order to use the dependabot badge with a private GitHub repository you will need to get its id. You can use the [GitHub API](https://developer.github.com/v3/) and [curl](https://curl.haxx.se/docs/manual.html) to do this like so:
<pre>
curl -u "<b>$your_username</b>" https://api.github.com/repos/<b>$repo_owner</b>/<b>$repo_name</b>
</pre>
* _\`$your_username\` is well your GitHub username for authentication._
* _\`$repo_owner\` is the owner of the repo e.g. badgen._
* _\`$repo_name\` is the name of the repo e.g. badgen-icons._

You will need to have read permissions for the repo for this to work, and once entering the command you will be prompted to provide a password for your GitHub account. If you use 2 factor authentication use one of the following 2 methods:

* Pass a 2 factor authentication code
  <pre>
  curl -u "$your_username" <b>--header 'x-github-otp: $2fa_code'</b> https://api.github.com/repos/$repo_owner/$repo_name
  </pre>
  * _\`$2fa_code\` is the 2 factor authentication code from your phone._

* Pass a personal access token
  <pre>
  curl <b>--header 'Authorization: token $pat_token'</b> https://api.github.com/repos/$repo_owner/$repo_name
  </pre>
  * _\`$pat_token\` is a personal authentication token (see [this article](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line))._

Running one of the above curl commands should output a large JSON object of all the repository details, all we want is the "id" field, it should be the first item and be a 9 digit number.

Once you have found the id for your repo, you can use it with the badgen dependabot endpoint like so:
<pre>
https://badgen.net/dependabot/badgen/example-private-repo/<b>123456789</b>?icon=dependabot
</pre>
`

export default createBadgenHandler({
  title: 'Dependabot',
  help,
  examples: {
    '/dependabot/thepracticaldev/dev.to?icon=dependabot': 'status',
    '/dependabot/dependabot/dependabot-core?icon=dependabot': 'status'
  },
  handlers: {
    '/dependabot/:owner/:repo/:identifier?': handler
  }
})

async function handler ({ owner, repo, identifier }: PathArgs) {
  // https://github.com/dependabot/feedback/issues/6#issuecomment-503994253
  let endpoint = `https://api.dependabot.com/badges/status?host=github&repo=${owner}/${repo}`
  if (identifier) {
    endpoint += `&identifier=${identifier}`
  }
  const { status, colour } = await got(endpoint).json<any>()

  return {
    subject: 'Dependabot',
    status,
    color: colour
  }
}
