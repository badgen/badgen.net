import got from 'got'
import { parse } from 'node-html-parser'

export default async function queryHTML(url: string, cssSelector: string) {
  const htmlString = await got(url).text()
  const root = parse(htmlString)
  return root.querySelector(cssSelector)
}
