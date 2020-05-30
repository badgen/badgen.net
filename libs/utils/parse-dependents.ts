import millify from 'millify'

export default ($el: Cheerio) => {
  const count = parseInt($el.text().replace(/,/g, ''), 10)
  return count ? millify(count) : 'unknown'
}
