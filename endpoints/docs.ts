import serveMarked from 'serve-marked'
import serve404 from '../libs/serve-404'
import genHelp from '../libs/gen-help'

// Handles `/docs/:name`
export default async function (req, res) {
  const [ , , name ] = req.url.split('/')
  const helpMarkdown = genHelp(name)

  if (helpMarkdown) {
    console.info(`DOC ${name}: ${req.url}`)
    return serveMarked(helpMarkdown, {
      title: `${name} badge | Badgen`,
      inlineCSS,
      beforeBodyEnd: helpFooter,
      trackingGA: process.env.TRACKING_GA
    })(req, res)
  }

  serve404(req, res)
}

const inlineCSS = `
  .markdown-body { max-width: 850px }
  li > img { vertical-align: middle; margin: 0.2em 0; font-size: 12px }
  li > img + a { font-family: monospace; font-size: 0.9em }
  li > img + a + i { color: #AAA }
`

const helpFooter = `
<footer>
  <div class='footer-content'>
    <div>
      <h3><img src='/static/badgen-logo-w.svg' />Badgen Service</h3>
      <div class='sitemap'>
        <a href='https://badgen.net'>Classic</a>
        <em>/</em>
        <a href='https://flat.badgen.net'>Flat</a>
        <em>/</em>
        <a href='/builder'>Builder</a>
        <em>/</em>
        <a href='https://github.com/badgen/badgen.net'>GitHub</a>
        <em>/</em>
        <a href='https://twitter.com/badgen_net'>Twitter</a>
        <br />
      </div>
    </div>
    <div class='bottom'>
      <div>
        Built with ♥ by <a href='https://github.com/amio'>Amio</a> and awesome <a href='https://github.com/badgen/badgen.net/graphs/contributors'>contributors</a>. Hosted on <a href='https://zeit.co/now'>Now</a>. License under <a href='https://github.com/badgen/badgen.net/blob/master/LICENSE.md'>ISC</a>.
      </div>
      <div class='links'>
        <a href='https://twitter.com/badgen_net'>
          <img src='https://simpleicons.now.sh/icons/twitter.svg?color=ffffff' />
        </a>
        <a href='https://github.com/badgen/badgen.net'>
          <img src='https://simpleicons.now.sh/icons/github.svg?color=ffffff' />
        </a>
      </div>
    </div>
  </div>
  <style>
    footer {
      margin-top: 5rem;
      background-color: #222;
      padding: 2rem 2rem;
      color: #777;
      font-size: 16px;
    }
    footer a {
      text-decoration: none;
    }
    .footer-content {
      margin: 0 auto;
    }
    footer h3 {
      font: 24px/32px Merriweather, serif;
      letter-spacing: 0.5px;
      color: #DDD;
    }
    footer h3 img {
      height: 21px;
      opacity: 0.8;
      margin-right: 8px;
      position: relative;
      top: 1px;
    }
    footer .sitemap {
      line-height: 26px;
      padding-bottom: 2em;
    }
    footer .sitemap a {
      color: #999;
      font-family: Merriweather;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    footer a:hover {
      color: #EEE;
      text-decoration: underline;
    }
    footer .sitemap em {
      color: #555;
      margin: 0 0.6rem;
    }
    footer .bottom {
      margin-top: 2rem;
      border-top: 1px solid #444;
      padding-top: 2rem;
      display: grid;
      grid-template-columns: 1fr 100px;
    }
    footer .bottom a {
      color: #999;
    }
    footer .links {
      text-align: right;
    }
    footer .links a {
      margin-left: 1em;
      opacity: 0.7;
    }
    footer .links a:hover {
      opacity: 1;
    }
    footer .links img {
      height: 22px;
      width: 22px
    }
  </style>
</footer>
`
