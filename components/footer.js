import Link from 'next/link'

export default () => (
  <footer>
    <div className='footer-content'>
      <div>
        <h3><img src='/static/badgen-logo-w.svg' />Badgen Service</h3>
        <div className='sitemap'>
          <Link href='/gallery'><a>Gallery</a></Link>
          <em>/</em>
          <Link href='https://api.badgen.net'><a>API</a></Link>
          <em>/</em>
          <Link href='https://status.badgen.net'><a>Status</a></Link>
        </div>
      </div>
      <div className='bottom'>
        <div>
          Built with ♥ by <a href='https://github.com/amio'>Amio</a> and awesome <a href='https://github.com/amio/badgen-service/graphs/contributors'>contributors</a>. Hosted on <a href='https://zeit.co/now'>Now Cloud</a>. License under <a href='https://github.com/amio/badgen-service/blob/master/LICENSE.md'>ISC</a>.
        </div>
        <div className='links'>
          <a href='https://twitter.com/badgen_service'>
            <img src='https://simpleicons.now.sh/icons/twitter.svg?color=ffffff' />
          </a>
          <a href='https://github.com/amio/badgen-service'>
            <img src='https://simpleicons.now.sh/icons/github.svg?color=ffffff' />
          </a>
        </div>
      </div>
    </div>
    <style jsx>{`
      footer {
        background-color: #333;
        padding: 2rem 2rem;
        color: #777;
      }
      .footer-content {
        margin: 0 auto;
      }
      h3 {
        font: 22px/32px Merriweather, serif;
        color: #EEE;
      }
      h3 img {
        height: 20px;
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
      }
      a:hover {
        color: #EEE;
        text-decoration: underline;
      }
      .sitemap em {
        margin: 0 0.5rem;
      }
      .bottom {
        margin-top: 2rem;
        border-top: 1px solid #555;
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
        margin-left: 10px;
        opacity: 0.7;
      }
      .links a:hover {
        opacity: 1;
      }
      .links img {
        height: 20px;
      }
    `}</style>
  </footer>
)
