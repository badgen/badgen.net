import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'

export default class MyApp extends App {
  componentDidMount () {
    window.dataLayer = window.dataLayer || []
    function gtag () { window.dataLayer.push(arguments) }
    gtag('js', new Date())
    gtag('config', 'UA-4646421-14')
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>Badgen - Fast badge generating service</title>
          <link rel='icon' type='image/png' href='/static/favicon.png' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Merriweather:700,300'
          />
          <link rel='stylesheet' href='/static/index.css' />
          <script async src='https://www.googletagmanager.com/gtag/js?id=UA-4646421-14' />
        </Head>
        <Component {...pageProps} />
        <style jsx global>{`
          html, body { margin: 0; height: 100%; scroll-behavior: smooth }
          #__next { height: 100% }
          a { text-decoration: none }
        `}
        </style>
      </Container>
    )
  }
}
