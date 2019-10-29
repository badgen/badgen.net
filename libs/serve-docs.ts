import serveMarked from 'serve-marked'
import serve404 from '../libs/serve-404'
import genHelp from '../libs/gen-help'

export default async function (req, res, name) {
  const helpMarkdown = genHelp(name)

  if (helpMarkdown) {
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')

    return serveMarked(helpMarkdown, {
      title: `${name} badge | Badgen`,
      inlineCSS,
      beforeHeadEnd: '<link rel="icon" href="/favicon.png">',
      beforeBodyEnd: helpFooter,
      trackingGA: process.env.TRACKING_GA
    })(req, res)
  }

  serve404(req, res)
}

const inlineCSS = `
  html, body { scroll-behavior: smooth }
  .markdown-body { max-width: 850px }
  .markdown-body h1 { margin-bottom: 42px }
  li > img { vertical-align: middle; margin: 0.2em 0; font-size: 12px; float: right }
  li > img + a { font-family: monospace; font-size: 0.9em }
  li > img + a + i { color: #AAA }
  h4 a code { color: #333; font-size: 1rem }
  h4 a:hover { text-decoration: none !important }
  h4 { padding: 4px 0 }
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
        Built with ♥ by <a href='https://github.com/amio'>Amio</a> and awesome <a href='https://github.com/badgen/badgen.net/graphs/contributors'>contributors</a>. Powered by ZEIT <a href='https://now.sh'>Now</a>. License under <a href='https://github.com/badgen/badgen.net/blob/master/LICENSE.md'>ISC</a>.
      </div>
      <div class='links'>
        <a href='https://twitter.com/badgen_net'>
          <img src='https://simpleicons.now.sh/twitter/fff' />
        </a>
        <a href='https://github.com/badgen/badgen.net'>
          <img src='https://simpleicons.now.sh/github/fff' />
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
