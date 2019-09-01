import semver from 'semver'

export default (v1: any, v2: any) => {
  v1 = semver.coerce(String(v1))
  v2 = semver.coerce(String(v2))

  const isV1Valid = v1 !== null && !!semver.valid(v1)
  const isV2Valid = v2 !== null && !!semver.valid(v2)

  if (isV1Valid && isV2Valid) {
    return semver.compare(v1, v2)
  }

  if (isV1Valid) {
    return 1
  }

  if (isV2Valid) {
    return -1
  }
}
