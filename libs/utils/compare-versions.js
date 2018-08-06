const semver = require('semver')

module.exports = (v1, v2) => {
  const validV1 = semver.valid(semver.coerce(v1))
  const validV2 = semver.valid(semver.coerce(v2))

  const isV1Valid = !!validV1
  const isV2Valid = !!validV2

  if (isV1Valid && isV2Valid) {
    return semver.compare(validV1, validV2)
  }

  if (isV1Valid && !isV2Valid) {
    return 1
  }
  if (!isV1Valid && isV2Valid) {
    return -1
  }

  return v1.localeCompare(v2)
}
