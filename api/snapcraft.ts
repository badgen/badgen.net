import got from '../libs/got'
import { version, versionColor, size } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const SNAPCRAFT_API_URL = 'https://api.snapcraft.io/'

const uniq = <T = any>(arr: T[]) => [...new Set(arr)]

const client = got.extend({
  prefixUrl: SNAPCRAFT_API_URL,
  headers: { 'Snap-Device-Series': '16' }
})

export default createBadgenHandler({
  title: 'Snapcraft',
  examples: {
    '/snapcraft/v/joplin-desktop': 'version',
    '/snapcraft/v/mattermost-desktop/i386': 'version',
    '/snapcraft/v/telegram-desktop/arm64/edge': 'version',
    '/snapcraft/license/okular': 'license',
    '/snapcraft/size/beekeeper-studio': 'distribution size',
    '/snapcraft/size/beekeeper-studio/arm64': 'distribution size',
    '/snapcraft/size/beekeeper-studio/armhf/edge': 'distribution size',
    '/snapcraft/architecture/telegram-desktop': 'supported architectures'
  },
  handlers: {
    '/snapcraft/:topic<v|version|size>/:snap/:architecture?/:channel?': handler,
    '/snapcraft/:topic<l|license|arch|architecture>/:snap': handler
  }
})

async function handler ({ topic, snap, architecture, channel: name }: PathArgs) {
  switch (topic) {
    case 'v':
    case 'version': {
      // https://api.snapcraft.io/docs/info.html#snap_info
      const searchParams = { fields: 'version' }
      const info = await client.get(`v2/snaps/info/${snap}`, { searchParams }).json<any>()
      const matchChannel = createChannelMatcher(architecture, name)
      const ver = info['channel-map'].find(matchChannel)?.version
      return {
        subject: 'snap',
        status: ver ? version(ver) : 'unknown',
        color: ver ? versionColor(ver) : 'grey'
      }
    }
    case 'l':
    case 'license': {
      // https://api.snapcraft.io/docs/info.html#snap_info
      const searchParams = { fields: 'license' }
      const info = await client.get(`v2/snaps/info/${snap}`, { searchParams }).json<any>()
      const license = info?.snap?.license
      return {
        subject: 'license',
        status: license || 'unknown',
        color: 'blue'
      }
    }
    case 'size': {
      // https://api.snapcraft.io/docs/info.html#snap_info
      const searchParams = { fields: 'download' }
      const info = await client.get(`v2/snaps/info/${snap}`, { searchParams }).json<any>()
      const matchChannel = createChannelMatcher(architecture, name)
      const download = info['channel-map'].find(matchChannel)?.download
      return {
        subject: 'distrib size',
        status: download ? size(download.size) : 'unknown',
        color: download ? 'green' : 'grey'
      }
    }
    case 'arch':
    case 'architecture': {
      // https://api.snapcraft.io/docs/info.html#snap_info
      const info = await client.get(`v2/snaps/info/${snap}`).json<any>()
      const architectures = uniq(info['channel-map'].map(it => it.channel.architecture)).join(' | ')
      return {
        subject: 'architecture',
        status: architectures || 'unknown',
        color: architectures ? 'blue' : 'grey'
      }
    }
  }
}

function createChannelMatcher(arch: string, name: string) {
  const matchArch = arch
    ? ({ channel }) => channel.architecture === arch
    : () => true
  const matchName = name
    ? ({ channel }) => channel.name === name
    : () => true
  return it => matchArch(it) && matchName(it)
}
