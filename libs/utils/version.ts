/**
 * Formats the given version.
 *
 * Examples
 *   '1.2.3' => 'v1.2.3'
 *   'v1.2.3' => 'v1.2.3'
 *   'dev-master' => 'dev-master',
 *   '' => 'unknown'
 *   undefined => 'unknown'
 *   0 => 'v0'
 */
export default (version) => {
  if (!version && version !== 0) {
    return 'unknown'
  }

  version = String(version)

  const firstChar = version.charAt(0)
  if (firstChar === 'v' || isNaN(parseInt(firstChar, 10))) {
    return version
  }

  return `v${version}`
}
