const serveMarked = require('serve-marked')

module.exports = serveMarked('libs/index.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    body { max-width: inherit }
    body > * { width: 960px; margin-left: auto; margin-right: auto; box-sizing: border-box }
    h1 + p { letter-spacing: 0.1px }
    h1 + p a { display: inline-block; margin-top: 1em; padding: 4px; height: 20px }
    img { height: 20px }

    table { border-spacing: 0; vertical-align: top; font-family: Roboto, sans-serif }
    td { padding-right: 0.6em; height: 28px; font-size: 14px; white-space: nowrap }
    td img { position: relative; top: 2px }
    td a { font: 14px/20px monospace }
    pre, code { background-color: #f2f5f9; font-weight: 400 }
    pre > code { padding: 0 }
    table code { padding: 0.3em 0.5em; display: pre }

    dl { margin-top: 0 }
    dt { margin-bottom: 1em; padding-top: 1em; border-bottom: 1px solid #DDD; line-height: 2em }
    dt a { color: #333; position: relative }
    dt a:hover { text-decoration: none }
    dt a.title:hover:before { content: '➻'; display: inline-block; width: 0px; position: relative }
    dt a.title:hover:before { left: -1.2em; font: 20px/20px Arial; vertical-align: middle; color: #CCC }
    dt a.doc { background: #CCC; color: #FFF; font: 14px/16px verdana, sans-serif; height: 16px; width: 16px }
    dt a.doc { border-radius: 50%; display: inline-block; text-align: center; margin-left: 0.5em }
    dt a.doc:hover { background-color: #BBB }
    dd { font: 14px/20px monospace; vertical-align: top; height: 28px; white-space: nowrap; margin: 0 }
    dd img { vertical-align: top }
    dd b { font-family: Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif }
    dd b { display: inline-block; min-width: 15em; text-align: right; font-weight: 300; color: #999 }
    dd i { display: inline-block; min-width: 13.5em }

    #the-end { margin: 5rem auto; text-align: center; text-shadow: 0 0 4px rgba(0,0,0,0.1) }

    #footer { width: 100vw; margin: 0 -1rem; background-color: #333; color: #CCC }
    #foo-content { max-width: 960px; margin: 0 auto; padding: 2rem 1rem; letter-spacing: 0.5px }
    #foo-content { display: grid; grid-template-columns: 1fr 1fr }
    #foo-content h3 { font-weight: 300 }
    #foo-content p { line-height: 2em; font-weight: 300 }
    #foo-content a { color: #FFF }
    #foo-content aside { padding: 1rem 1rem; display: flex; justify-content: flex-end; align-items: flex-end }
    #foo-content aside a { line-height: 2em; margin-left: 1rem }
  `,
  beforeHeadEnd: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
  beforeBodyEnd: `
    <div id="the-end">⚡️</div>
    <div id="footer">
      <div id="foo-content">
        <segment>
          <h3>Badgen Service</h3>
          <p>
            built with ♥<br/>
            by <a href="https://github.com/amio">Amio</a>
            and awesome <a href="https://github.com/amio/badgen-service/graphs/contributors">contributors</a><br/>
            hosted on <a href="https://zeit.co/now">Now Cloud</a>
          </p>
        </segment>
        <aside>
          <a href="https://github.com/amio/badgen-service">GitHub</a>
          <a href="https://twitter.com/badgen_net">Twitter</a>
        </aside>
      </div>
    </div>
  `,
  trackingGA: 'UA-4646421-14'
})
