const indexOrEnd = (str, q) => str.indexOf(q) === -1 ? str.length : str.indexOf(q)
const parseNumber = v => isNaN(Number(v)) ? v : Number(v)

const split = (v) => {
  var c = v.replace(/^v/, '').replace(/\+.*$/, '')
  var patchIndex = indexOrEnd(c, '-')
  var arr = c.substring(0, patchIndex).split('.')
  arr.push(c.substring(patchIndex + 1))
  return arr
}

// See: https://github.com/omichelsen/compare-versions
module.exports = (v1, v2) => {
  var s1 = split(v1)
  var s2 = split(v2)

  for (var i = 0; i < Math.max(s1.length - 1, s2.length - 1); i++) {
    var n1 = parseInt(s1[i] || 0, 10)
    var n2 = parseInt(s2[i] || 0, 10)

    if (n1 > n2) return 1
    if (n2 > n1) return -1
  }

  var sp1 = s1[s1.length - 1]
  var sp2 = s2[s2.length - 1]

  if (sp1 && sp2) {
    var p1 = sp1.split('.').map(parseNumber)
    var p2 = sp2.split('.').map(parseNumber)

    for (i = 0; i < Math.max(p1.length, p2.length); i++) {
      if (p1[i] === undefined || (typeof p2[i] === 'string' && typeof p1[i] === 'number')) return -1
      if (p2[i] === undefined || (typeof p1[i] === 'string' && typeof p2[i] === 'number')) return 1

      if (p1[i] > p2[i]) return 1
      if (p2[i] > p1[i]) return -1
    }
  } else if (sp1 || sp2) {
    return sp1 ? -1 : 1
  }

  return 0
}
