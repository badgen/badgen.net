import { restGithub } from '../../libs/github'
import { basename, extname } from 'path'
import { version, versionColor } from '../../libs/utils'
import { createBadgenHandler } from '../../libs/create-badgen-handler-next'

import type { PathArgs, BadgenResult } from '../../libs/create-badgen-handler-next'

const WINGET_GITHUB_REPO = 'microsoft/winget-pkgs'

const last = <T>(arr: T[]): T => arr[arr.length - 1]

interface Part {
  number: number
  other: string
}

class Version {
  _source: string
  _parts: Part[]

  constructor (input: string) {
    this._source = input

    const parts = input.split('.').map(segment => {
      return new Version.Part(segment)
    })

    while (parts.length) {
      const part = last(parts)
      if (part.number || part.other) break
      parts.pop()
    }

    this._parts = parts
  }

  get parts() {
    return this._parts
  }

  toString() {
    return this._source
  }

  static comparator(versionA: Version, versionB: Version): number {
    let i = 0
    while (i < versionA.parts.length) {
      if (i >= versionB.parts.length) break

      const partA = versionA.parts[i]
      const partB = versionB.parts[i]
      const result = Version.Part.comparator(partA, partB)
      if (result) return result

      i += 1
    }

    if (versionA.parts.length < versionB.parts.length) return -1
    if (versionA.parts.length > versionB.parts.length) return 1
    return 0
  }

  private static Part = class implements Part {
    _source: string
    _number: number
    _other: string

    constructor(input: string) {
      this._source = input

      const [num, rest] = input.split(/([^\d]+)/)
      this._number = parseInt(num, 10) || 0
      this._other = rest
    }

    get number() {
      return this._number
    }

    get other() {
      return this._other
    }

    toString() {
      return this._source
    }

    static comparator(partA: Part, partB: Part): number {
      if (partA.number < partB.number) return -1
      if (partA.number > partB.number) return 1
      if (partA.other < partB.other) return -1
      if (partA.other > partB.other) return 1
      return 0
    }
  }
}

export default createBadgenHandler({
  title: 'winget',
  examples: {
    '/winget/v/aria2.aria2': 'version',
    '/winget/v/Amazon.AWSCLI': 'version',
  },
  handlers: {
    '/winget/:topic/:appId': handler,
  }
})

async function handler ({ topic, appId }: PathArgs): BadgenResult {
  switch (topic) {
    case 'v': {
      const versions = await fetchVersions(appId)
      const ver = last(versions).toString()

      return {
        subject: 'winget',
        status: version(ver),
        color: versionColor(ver)
      }
    }
    case 'license': {
      return {
        subject: 'license',
        status: 'unknown',
        color: 'blue'
      }
    }
    default:
      return {
        subject: 'winget',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

async function fetchVersions(appId: string): Promise<Version[]> {
  const appPath = appId.replace(/\./g, '/')
  const categoryPath = appPath[0].toLowerCase()
  const files = await restGithub<any[]>(`repos/${WINGET_GITHUB_REPO}/contents/manifests/${categoryPath}/${appPath}`)
  const versions = files.map(file => {
    const name = basename(file.name, extname(file.name))
    return new Version(name)
  })
  versions.sort(Version.comparator)
  return versions
}
