/* eslint-disable @next/next/no-css-tags */
import React from 'react'
import App from 'next/app'
import { Html, Head } from 'next/document'
import Script from 'next/script'

declare global {
  interface Window {
    dataLayer: Array<any>;
  }
}

export default class MyApp extends App {
  componentDidMount () {
    window.dataLayer = window.dataLayer || []
    function gtag (...args) { window.dataLayer.push(args) }
    gtag('js', new Date())
    gtag('config', 'UA-4646421-14')
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Html>
        <Head>
          <link rel='icon' type='image/png' href='/static/favicon.png' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Merriweather:700,300&display=optional'
          />
          <link rel='stylesheet' href='/static/index.css' />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=UA-4646421-14"
            strategy="afterInteractive"
          />
        </Head>
        <Component {...pageProps} />
        <style>{`
          html, body { margin: 0; height: 100%; scroll-behavior: smooth }
          #__next { height: 100% }
          a { text-decoration: none }
        `}
        </style>
      </Html>
    )
  }
}
