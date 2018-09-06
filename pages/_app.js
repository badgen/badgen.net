import React from 'react'
import App, { Container } from 'next/app'

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Component {...pageProps} />
        <style jsx global>{`
          html, body { margin: 0; height: 100% }
          #__next { height: 100% }
        `}</style>
      </Container>
    )
  }
}
