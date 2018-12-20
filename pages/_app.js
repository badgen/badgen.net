import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import DocsLayout from '../components/docs-layout.js'
import Footer from '../components/footer.js'

export default class MyApp extends App {
  render () {
    const { Component, pageProps, router } = this.props
    const pageContent = router.route.startsWith('/docs/')
      ? <DocsLayout><Component {...pageProps} /></DocsLayout>
      : <Component {...pageProps} />

    return (
      <Container>
        <Head>
          <link rel='icon' type='image/png' href='/static/favicon.png' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Merriweather:700,300' />
          <link rel='stylesheet' href='/static/index.css' />
        </Head>
        { pageContent }
        <style jsx global>{`
          html, body { margin: 0; height: 100%; scroll-behavior: smooth }
          #__next { height: 100% }
          a { text-decoration: none }
        `}</style>
      </Container>
    )
  }
}
