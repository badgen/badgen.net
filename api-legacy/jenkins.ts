import got from "../libs/got"
import { createBadgenHandler, PathArgs } from "../libs/create-badgen-handler"
import humanizeDuration from "humanize-duration"

export default createBadgenHandler({
  title: "Jenkins",
  examples: {
    "/jenkins/last-build/jenkins.mono-project.com/job/test-mono-mainline/":
      "Last build status",
    "/jenkins/fix-time/jenkins.mono-project.com/job/test-mono-mainline/":
      "Time taken to fix a broken build",
    "/jenkins/broken-build/jenkins.mono-project.com/job/test-mono-mainline/":
      "# of broken builds",
  },
  handlers: {
    "/jenkins/last-build/:hostname/:job*": lastJobStatusHandler,
    "/jenkins/fix-time/:hostname/:job*": buildFixTimeHandler,
    "/jenkins/broken-build/:hostname/:job*": brokenBuildsHandler,
  },
})

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  units: ["d", "h"],
  round: true,
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
})

const statusToColor = (status: string) => {
  return status.toUpperCase() === "SUCCESS" ? "green" : "red"
}

const brokenBuildsToColor = (count: number) => {
  return count < 10 ? "green" : count < 20 ? "orange" : "red"
}
const buildFixTimeToColor = (hours: number) => {
  return hours < 2 ? "green" : hours < 6 ? "orange" : "red"
}

async function jenkinsLastBuild({ hostname, job }: PathArgs) {
  const endpoint = `https://${hostname}/${job}/lastBuild/api/json?tree=result,timestamp,estimatedDuration`
  return await got(endpoint).json<any>()
}

async function jenkinsBuilds({ hostname, job }: PathArgs) {
  const endpoint = `https://${hostname}/${job}/api/json?tree=builds[number,status,timestamp,id,result]`
  return await got(endpoint).json<any>()
}

async function lastJobStatusHandler({ hostname, job }: PathArgs) {
  const response = await jenkinsLastBuild({ hostname, job })
  return {
    subject: "Last Build",
    status: response.result,
    color: statusToColor(response.result),
  }
}

async function brokenBuildsHandler({ hostname, job }: PathArgs) {
  const response = await jenkinsBuilds({ hostname, job })
  const brokenBuilds = response.builds.filter(function (build) {
    return build.result.toUpperCase() !== "SUCCESS"
  })
  return {
    subject: "Broken Builds",
    status: brokenBuilds.length,
    color: brokenBuildsToColor(brokenBuilds.length),
  }
}

async function buildFixTimeHandler({ hostname, job }: PathArgs) {
  const response = await jenkinsBuilds({ hostname, job })

  var lastSuccessTime = 0
  var lastFailTime = 0

  for (let index = 0; index < response.builds.length; index++) {
    const element = response.builds[index]
    if (element.result.toUpperCase() == "SUCCESS") {
      lastSuccessTime = element.timestamp
      lastFailTime = lastSuccessTime
    } else {
      lastFailTime = element.timestamp
      break
    }
  }
  if (lastSuccessTime == 0) lastSuccessTime = new Date().getTime()
  if (lastFailTime == 0) lastFailTime = lastSuccessTime

  return {
    subject: "Fix Time",
    status: `${shortEnglishHumanizer((lastSuccessTime - lastFailTime) | 0)}`,
    color: buildFixTimeToColor(
      ((lastSuccessTime - lastFailTime) / 3600000) | 0
    ),
  }
}
