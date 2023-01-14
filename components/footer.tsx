/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Image from 'next/image'

export default function Footer () {
  return (
  <footer>
    <div className='footer-content'>
      <div>
        <h3>
          <img alt='badgen logo' src='/statics/badgen-logo-w.svg' />
          Badgen Service
        </h3>
        <div className='sitemap'>
          <Link href='https://badgen.net'>Classic</Link>
          <em>/</em>
          <Link href='https://flat.badgen.net'>Flat</Link>
          <em>/</em>
          <Link href='https://github.com/badgen/badgen.net'>GitHub</Link>
          <em>/</em>
          <Link href='https://twitter.com/badgen_net'>Twitter</Link>
          <em>/</em>
          <Link href='https://opencollective.com/badgen'>OpenCollective</Link>
          <br />
        </div>
      </div>
      <div className='bottom'>
        <div>
          Built with ♥ by <a href='https://github.com/amio'>Amio</a> and
          awesome <a href='https://github.com/badgen/badgen.net/graphs/contributors'>contributors</a>.
          Powered by <a href='https://vercel.com'>Vercel</a>.
        </div>
        <div className='links'>
          <a title='badgen twitter link' href='https://twitter.com/badgen_net'>
            <img alt='badgen twitter link' src='https://simpleicons.vercel.app/twitter/fff' width='30' height='30' />
          </a>

          <a href='https://github.com/badgen/badgen.net'>
            <img alt='badgen github link' src='https://simpleicons.vercel.app/github/fff' width='30' height='30' />
          </a>
        </div>
      </div>
    </div>
  </footer>
)}
