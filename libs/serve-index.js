const serveMarked = require('serve-marked')

module.exports = serveMarked('libs/index.md', {
  title: 'Badgen - Fast badge generating service',
  preset: 'merri',
  inlineCSS: `
    body { max-width: 890px; padding-bottom: 1em }
    table { border-spacing: 0 }
    td { padding: 0 1em 0 0; font-size: 14px; white-space: nowrap; height: 26px }
    td img { height: 20px; position: relative; top: 2px }
    td a { font: 12px/14px monospace }
    pre, code { background-color: #f4f6f9; font-weight: 400 }
    li code { padding: 0.2em 0.4em; display: pre }
    li { padding: 0.4em 0 }
    h1 + p { letter-spacing: 0.1px }
    h1 + p img { margin-top: 1em }
  `,
  beforeHeadEnd: `<link rel="icon" href="/favicon.svg">`,
  beforeBodyEnd: `
    <script>
      if (window.location.hostname === 'flat.badgen.net') {
        const code = document.querySelector('pre code')
        code.innerText = code.innerText.replace(
          'badgen.net',
          'flat.badgen.net'
        ).replace(/\\n/g, '\\n     ')
      }
    </script>
  `,
  trackingGA: 'UA-4646421-14'
})
