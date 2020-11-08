import got from '../libs/got'
import { version as versionName, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Cocoapods',
  examples: {
    '/cocoapods/v/AFNetworking': 'version',
    '/cocoapods/p/AFNetworking': 'platform',
  },
  handlers: {
    '/cocoapods/:topic<v|p>/:pod': handler
  }
})

async function handler ({topic, pod}: PathArgs) {
  const endpoint = `https://trunk.cocoapods.org/api/v1/pods/${pod}/specs/latest`
  const { version, platforms } = await got(endpoint).json<any>()

  switch (topic) {
    case 'v':
      return {
        subject: 'pod',
        status: versionName(version),
        color: versionColor(version)
      }
    case 'p':
      return {
        subject: 'platform',
        status: Object.keys(platforms).join(' | '),
        color: 'grey'
      }
  }
}
