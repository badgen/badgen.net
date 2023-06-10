import '../styles/globals.css'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
        {/* <meta name='viewport' content='initial-scale=1.0, width=device-width' /> */}
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
