import byteSize from 'byte-size'

export default size => {
  return byteSize(size, { units: 'iec' }).toString().replace(/iB\b/, 'B')
}
