/**
 * Generate color from semver string.
 *
 * Examples
 *    '1.2.3' => 'blue'
 *    '0.1.2' => 'orange'
 *    '1.2.3-beta.0' => 'cyan'
 *    '1.2.3-alpha.0' => 'cyan'
 *    '1.2.3-canary.0' => 'cyan'
 *    '0.1.2-canary.0' => 'cyan'
 */

module.exports = function vc (version) {
  if (version.match(/\b(alpha|beta|canary|rc|dev)/i)) {
    return 'cyan'
  }

  if (version.startsWith('0.')) {
    return 'orange'
  }

  return 'blue'
}
