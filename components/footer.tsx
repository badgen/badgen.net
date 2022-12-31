import Link from 'next/link'
import Image from 'next/image'

export default function Footer () {
  return (
  <footer>
    <div className='footer-content'>
      <div>
        <h3>
          <img alt='badgen logo' src='/static/badgen-logo-w.svg' />
          Badgen Service
        </h3>
        <div className='sitemap'>
          <Link href='https://badgen.net'>Classic</Link>
          <em>/</em>
          <Link href='https://flat.badgen.net'>Flat</Link>
          <em>/</em>
          <Link href='/builder'>Builder</Link>
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
            <img alt='badgen twitter link' src='https://simpleicons.now.sh/twitter/fff' width='30' height='30' />
          </a>

          <a href='https://github.com/badgen/badgen.net'>
            <img alt='badgen github link' src='https://simpleicons.now.sh/github/fff' width='30' height='30' />
          </a>

        </div>
      </div>
    </div>
    <style>{`
      footer {
        margin-top: 8rem;
        background-color: #222;
        padding: 2rem 2rem;
        color: #777;
      }
      .footer-content {
        margin: 0 auto;
      }
      footer h3 {
        font: 22px/32px Merriweather, Georgia, serif;
        letter-spacing: 0.5px;
        color: #DDD;
        margin-bottom: 1em;
      }
      footer h3 img {
        height: 21px;
        opacity: 0.8;
        margin-right: 8px;
        position: relative;
        top: 1px;
      }
      .sitemap {
        line-height: 26px;
      }
      .sitemap a {
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline;
      }
      a:hover {
        color: #EEE;
        text-decoration: underline;
      }
      .sitemap em {
        color: #555;
        margin: 0 0.6rem;
      }
      .bottom {
        margin-top: 2rem;
        border-top: 1px solid #444;
        padding-top: 2rem;
        display: grid;
        grid-template-columns: 1fr 100px;
      }
      .bottom a {
        color: #999;
        display: inline;
      }
      .links {
        text-align: right;
      }
      .links a {
        opacity: 0.7;
        display: inline;
      }
      .links a:hover {
        opacity: 1;
      }
      .links img {
        height: 22px;
      }
    `}
    </style>
  </footer>
)}
