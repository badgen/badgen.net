import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <link rel='icon' type='image/png' href='/static/favicon.png' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Merriweather:700,300' />
        </Head>
        <Component {...pageProps} />
        <style jsx global>{`
          html, body { margin: 0; height: 100% }
          #__next { height: 100% }
        `}</style>
      </Container>
    )
  }
}
