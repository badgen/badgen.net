import got from '../libs/got'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const SHARDS_REPO_URL = 'https://shardbox.org/'

const client = got.extend({ prefixUrl: SHARDS_REPO_URL })

export default createBadgenHandler({
  title: 'Crystal shards',
  examples: {
    '/shards/v/kemal': 'version',
    '/shards/license/clear': 'license',
    '/shards/crystal/amber': 'crystal version',
    '/shards/dependents/lucky': 'dependents'
  },
  handlers: {
    '/shards/:topic<v|license|crystal|dependents>/:shard': handler
  }
})

async function handler({ topic, shard }: PathArgs) {
  const html = await client.get(`shards/${shard}`).text()

  switch (topic) {
    case 'v':
      const ver = html.match(/class="version">([^<]+)<\//i)?.[1].trim()
      return {
        subject: 'shards',
        status: version(ver),
        color: versionColor(ver)
      }
    case 'license': {
      const license = html.match(/opensource.org\/licenses\/[^>]+?>([^<]+)<\//i)?.[1].trim()
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
    case 'crystal': {
      let ver = html.match(/Crystal<\/span>\s*<span[^>]*?>([^<]+)<\//i)?.[1].trim()
      if (!ver || ver === 'none') ver = '*'
      return {
        subject: 'crystal',
        status: version(ver),
        color: 'green'
      }
    }
    case 'dependents': {
      const dependents = Number(html.match(/Dependents[^>]*? class="count">([^<]+)<\//i)?.[1].trim())
      return {
        subject: 'dependents',
        status: millify(dependents),
        color: 'green'
      }
    }
  }
}
