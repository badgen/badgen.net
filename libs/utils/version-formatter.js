/**
 * Formats the given version.
 *
 * Examples
 *   '1.2.3' => 'v1.2.3'
 *   'v1.2.3' => 'v1.2.3'
 *   'dev-master' => 'dev-master',
 *   '' => 'unknown'
 */
module.exports = (version) => {
  if (!version) {
    return 'unknown'
  }

  const firstChar = version.charAt(0)
  if (firstChar === 'v' || isNaN(parseInt(firstChar, 10))) {
    return version
  }

  return `v${version}`
}
