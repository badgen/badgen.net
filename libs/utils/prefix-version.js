/**
 * Prefix the the version with a "v".
 *
 * Examples
 *   '1.2.3' => 'v1.2.3'
 *   'v1.2.3' => 'v1.2.3'
 *   'dev-master' => 'dev-master'
 */
module.exports = (version) => {
  const firstChar = version.charAt(0)
  if (!version || firstChar === 'v' || isNaN(parseInt(firstChar, 10))) {
    return version
  }

  return `v${version}`
}
