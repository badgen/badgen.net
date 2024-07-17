import http from 'http'
import matchRoute from 'my-way'
import { serveMarked } from 'serve-marked'
import serve404 from '../libs/serve-404'
import { BadgenServeConfig } from '../libs/create-badgen-handler'

const { GA_MEASUREMENT_ID = 'G-PD7EFJDYFV' } = process.env

export default function serveDoc (conf: BadgenServeConfig): http.RequestListener {
  return (req, res) => {
    const helpMarkdown = generateHelpMarkdown(conf)

    if (helpMarkdown) {
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')

      return serveMarked(helpMarkdown, {
        title: `${conf.title} badge | Badgen`,
        inlineCSS,
        beforeHeadEnd: `
          <link rel="icon" href="/favicon.png" />
          <!-- Google tag (gtag.js) -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          </script>
        `,
        beforeBodyEnd: helpFooter,
      })(req, res)
    }

    serve404(req, res)
  }
}

function generateHelpMarkdown ({ title, help, examples, handlers }: BadgenServeConfig): string {
  const mainTitle = `# ${title} Badge`

  const customHelp = help || ''

  const exampleTitle = `## Examples`

  const routes = Object.keys(handlers)
  const categorizedExamples = Object.entries(examples).reduce((accu, [url, desc]) => {
    const scheme = routes.find(route => matchRoute(route, url))
    if (scheme) {
      accu[scheme] ? accu[scheme].push({ url, desc }) : accu[scheme] = [{ url, desc }]
    }
    return accu
  }, {})

  const examplesSection = Object.entries(categorizedExamples).reduce((accu, [header, list]) => {
    const hash = hashify(header)
    const h4 = `<h4 id="${hash}"><a href="#${hash}"><code>${header.replace(/</g, '&lt;')}</code></a></h4>`
    const ul = (list as Array<any>).reduce((acc, { url, desc }) => {
      return `${acc}\n- ![${url}](${url}) [${url}](${url}) <i>${desc}</i>`
    }, '')
    return `${accu}\n\n${h4}\n\n${ul}`
  }, '')

  return [mainTitle, customHelp, exampleTitle, examplesSection].join('\n\n')
}

// turn `/github/:topic<commits|last-commit>/:owner/:repo/:ref?`
// into `github-topic-commits-last-commit-owner-repo-ref`
function hashify (str: string) {
  // return str.replace(/[^\w]/g, '')
  return str.split(/[^\w]+/).filter(Boolean).join('-')
}

const inlineCSS = `
  html, body { scroll-behavior: smooth }
  .markdown-body { max-width: 960px; min-height: calc(100vh - 348px) }
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
      <h3><img src='/statics/badgen-logo-w.svg' />Badgen Service</h3>
      <div class='sitemap'>
        <a href='https://badgen.net'>Classic</a>
        <em>/</em>
        <a href='https://flat.badgen.net'>Flat</a>
        <em>/</em>
        <a href='https://github.com/badgen/badgen.net'>GitHub</a>
        <em>/</em>
        <a href='https://twitter.com/badgen_net'>Twitter</a>
        <em>/</em>
        <a href='https://opencollective.com/badgen'>OpenCollective</a>
        <br />
      </div>
    </div>
    <div class='bottom'>
      <div>
        Built with ♥ by <a href='https://github.com/amio'>Amio</a> and awesome <a href='https://github.com/badgen/badgen.net/graphs/contributors'>contributors</a>. Powered by <a href='https://vercel.com'>Vercel</a>.
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
      background-color: #222;
      padding: 2rem 2rem;
      color: #777;
      font: 16px -apple-system,BlinkMacSystemFont, Segoe UI, Noto Sans ,Helvetica,Arial,sans-serif, Apple Color Emoji, Segoe UI Emoji ;
    }
    footer a {
      text-decoration: none;
    }
    .footer-content {
      margin: 0 auto;
    }
    footer h3 {
      font: 22px/32px Merriweather, Georgia, serif;
      letter-spacing: 0.5px;
      color: #DDD;
      margin-top: 0;
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
    }
    footer .sitemap a {
      color: #999;
      font: 16px -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans ,Helvetica,Arial,sans-serif, Apple Color Emoji, Segoe UI Emoji ;
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