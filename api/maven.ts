import got from '../libs/got'
import { version as versionName, versionColor } from '../libs/utils'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const MAVEN_CENTRAL_REPO_URL = 'https://repo1.maven.org/maven2/'
const JCENTER_REPO_URL = 'https://jcenter.bintray.com/'

export default createBadgenHandler({
  title: 'Maven',
  examples: {
    '/maven/v/maven-central/com.google.code.gson/gson': 'version (maven-central)',
    '/maven/v/jcenter/com.squareup.okhttp3/okhttp': 'version (jcenter)',
    '/maven/v/metadata-url/https/repo1.maven.org/maven2/com/google/code/gson/gson/maven-metadata.xml': 'version (maven metadata url)',
    '/maven/v/metadata-url/repo1.maven.org/maven2/com/google/code/gson/gson/maven-metadata.xml': 'version (maven metadata url)',
  },
  handlers: {
    '/maven/v/:repo<maven-central|jcenter>/:group/:artifact': mavenRepoHandler,
    '/maven/v/metadata-url/:protocol<https?:?>/:hostname/:pathname+': mavenUrlHandler,
    '/maven/v/metadata-url/:hostname/:pathname+': mavenUrlHandler,
  }
})

async function mavenRepoHandler ({ repo, group, artifact }: PathArgs) {
  group = group.replace(/\./g, '/')
  const endpoint = `${group}/${artifact}/maven-metadata.xml`

  const repoUrl = {
    'maven-central': MAVEN_CENTRAL_REPO_URL,
    jcenter: JCENTER_REPO_URL
  }[repo] || MAVEN_CENTRAL_REPO_URL

  const xml = await got(endpoint, { prefixUrl: repoUrl }).text()
  const version = xml.match(/<latest>([^<]+)<\//i)?.[1].trim() ?? 'unknown'
  return {
    subject: repo,
    status: versionName(version),
    color: versionColor(version)
  }
}

async function mavenUrlHandler ({ protocol = 'https:', hostname, pathname }: PathArgs) {
  const url = protocol.replace(/:?$/, `://${hostname}/${pathname}`)
  const xml = await got(url).text()
  const version = xml.match(/<latest>([^<]+)<\//i)?.[1].trim() ?? 'unknown'
  return {
    subject: 'maven',
    status: versionName(version),
    color: versionColor(version)
  }
}
