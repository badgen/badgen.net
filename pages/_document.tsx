import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='icon' type='image/png' href='/static/favicon.png' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Merriweather:700,300&display=optional' />
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=UA-4646421-14"
            strategy="afterInteractive"
          />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
