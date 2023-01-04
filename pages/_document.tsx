import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='icon' type='image/png' href='/static/favicon.png' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Merriweather:700,300&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Inter:700,300&display=swap' />
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
