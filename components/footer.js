import Link from 'next/link'

export default () => (
  <footer>
    <div className='footer-content'>
      <div>
        <h3><img src='/static/badgen-logo-w.svg' />Badgen Service</h3>
        <div className='sitemap'>
          <Link href='https://badgen.net'><a>Classic</a></Link>
          <em>/</em>
          <Link href='https://flat.badgen.net'><a>Flat</a></Link>
          <em>/</em>
          <Link href='/builder'><a>Builder</a></Link>
          <em>/</em>
          <Link href='https://github.com/badgen/badgen.net'><a>GitHub</a></Link>
          <em>/</em>
          <Link href='https://twitter.com/badgen_net'><a>Twitter</a></Link>
          <br />
        </div>
      </div>
      <div className='bottom'>
        <div>
          Built with ♥ by <a href='https://github.com/amio'>Amio</a> and awesome <a href='https://github.com/badgen/badgen.net/graphs/contributors'>contributors</a>. Hosted on <a href='https://zeit.co/now'>Now</a>. License under <a href='https://github.com/badgen/badgen.net/blob/master/LICENSE.md'>ISC</a>.
        </div>
        <div className='links'>
          <a href='https://twitter.com/badgen_net'>
            <img src='https://simpleicons.now.sh/twitter/fff' />
          </a>
          <a href='https://github.com/badgen/badgen.net'>
            <img src='https://simpleicons.now.sh/github/fff' />
          </a>
        </div>
      </div>
    </div>
    <style jsx>{`
      footer {
        background-color: #222;
        padding: 2rem 2rem;
        color: #777;
      }
      .footer-content {
        margin: 0 auto;
      }
      h3 {
        font: 24px/32px Merriweather, serif;
        letter-spacing: 0.5px;
        color: #DDD;
      }
      h3 img {
        height: 21px;
        opacity: 0.8;
        margin-right: 8px;
        position: relative;
        top: 1px;
      }
      .sitemap {
        line-height: 26px;
        padding-bottom: 2em;
      }
      .sitemap a {
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
      }
      .links {
        text-align: right;
      }
      .links a {
        margin-left: 1em;
        opacity: 0.7;
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
)
