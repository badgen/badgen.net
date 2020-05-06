import RpcClient from 'haxe-rpc-client'
import { millify, version, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const HAXELIB_RPC_URL = 'https://lib.haxe.org/api/3.0/index.n'

class HaxelibClient extends RpcClient {
  constructor() {
    super(HAXELIB_RPC_URL)
  }

  info(project) {
    return this.call<any>('api.infos', [project])
  }
}

export default createBadgenHandler({
  title: 'haxelib',
  examples: {
    '/haxelib/v/tink_http': 'version',
    '/haxelib/v/nme': 'version',
    '/haxelib/d/hxnodejs': 'downloads',
    '/haxelib/license/openfl': 'license'
  },
  handlers: {
    '/haxelib/:topic/:project': handler
  }
})

async function handler ({ topic, project }: PathArgs) {
  const client = new HaxelibClient()
  const { curversion: ver, downloads, license } = await client.info(project)

  switch (topic) {
    case 'v': {
      return {
        subject: 'haxelib',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
    case 'd': {
      return {
        subject: 'downloads',
        status: millify(downloads),
        color: 'green'
      }
    }
  }
}
