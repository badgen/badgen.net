import cheerio from 'cheerio'
import got from '../libs/got'
import { version as versionName, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Maven',
  examples: {
    '/maven/v/maven-central/com.google.code.gson/gson': 'version (maven-central)',
    '/maven/v/metadata-url/https/repo1.maven.org/maven2/com/google/code/gson/gson/maven-metadata.xml': 'version (maven metadata url)',
  },
  handlers: {
    '/maven/v/maven-central/:group/:artifact': mavenCentralHandler,
    '/maven/v/metadata-url/:path+': mavenUrlHandler,
  }
})

async function mavenCentralHandler ({group, artifact}: PathArgs) {
  group = group.replace(/\./g, '/')
  const xml = await got(`https://repo1.maven.org/maven2/${group}/${artifact}/maven-metadata.xml`).text()
  const version = getLastVersionFromMetadata(xml)
  return {
    subject: 'maven-central',
    status: versionName(version),
    color: versionColor(version)
  }
}

async function mavenUrlHandler ({path}: PathArgs) {
  if (path.startsWith('http/')) {
    path = path.slice(0, 4) + ':/' + path.slice(4)
  } else if (path.startsWith('https/')) {
    path = path.slice(0, 5) + ':/' + path.slice(5)
  } else if (path.startsWith('http:/')) {
    path = path.slice(0, 5) + '/' + path.slice(5)
  } else if (path.startsWith('https:/')) {
    path = path.slice(0, 6) + '/' + path.slice(6)
  }
  const xml = await got(path).text()
  const version = getLastVersionFromMetadata(xml)
  return {
    subject: 'maven',
    status: versionName(version),
    color: versionColor(version)
  }
}

const getLastVersionFromMetadata = (xml: string) => {
  const $ = cheerio.load(xml, {xmlMode: true})
  const versions = $('metadata').children('versioning').children('versions').children('version')
  if (versions.length === 0) {
    return 'unknown'
  }
  return versions.last().text()
}
