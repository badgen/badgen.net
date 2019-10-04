import React from 'react'
import Preview from '../components/builder-preview'
import Bar from '../components/builder-bar'
import Hints from '../components/builder-hints'
import Helper from '../components/builder-helper'
import Footer from '../components/footer'

export default class BuilderPage extends React.Component {
  state = {
    host: undefined,
    badgeURL: '',
    placeholder: '',
    focus: false
  }

  handleBlur = () => this.setState({ focus: false })

  handleFocus = () => this.setState({ focus: true })

  handleChange = badgeURL => this.setState({ badgeURL })

  handleSelect = exampleURL => this.setState({ badgeURL: exampleURL })

  componentDidMount () {
    const forceHost = new URL(window.location).searchParams.get('host')
    this.setState({
      host: (forceHost || window.location.origin) + '/',
      badgeURL: window.location.hash.replace(/^#/, ''),
      placeholder: 'badge/:subject/:status/:color?icon=github'
    })
  }

  render () {
    const { host, placeholder, badgeURL, focus } = this.state

    return (
      <div className='home'>
        <div className='hero'>
          <Preview host={host} badgeURL={badgeURL} focus={focus} />
          <Bar
            host={host}
            badgeURL={badgeURL}
            placeholder={placeholder}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
          />
          <Hints focus={focus} badgeURL={badgeURL} />
          {badgeURL && <Helper host={host} badgeURL={badgeURL} onSelect={this.handleSelect} />}
        </div>
        <Footer />
        <style jsx>{`
          .hero {
            min-height: 100vh;
            position: relative;
          }
        `}
        </style>
      </div>
    )
  }
}
