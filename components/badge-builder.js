import React from 'react'
import Preview from './builder-preview.js'
import Bar from './builder-bar.js'
import Helper from './builder-helper.js'

export default class extends React.Component {
  state = {
    host: undefined,
    badgeURL: '',
    placeholder: ''
  }

  setBadgeURL = badgeURL => this.setState({ badgeURL })

  componentDidMount () {
    const forceHost = new URL(window.location).searchParams.get('host')
    const autoHost = window.location.host === 'flat.badgen.net'
      ? 'https://flat.badgen.net'
      : 'https://badgen.net'
    this.setState({
      host: (forceHost || autoHost) + '/',
      placeholder: 'badge/:subject/:status/:color'
    })
  }

  render () {
    const { host, placeholder, badgeURL } = this.state

    return (
      <div>
        <Preview host={host} badgeURL={badgeURL} />
        <Bar host={host} placeholder={placeholder} onChange={this.setBadgeURL} />
        <Helper />
        <style jsx>{`
          div {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}
