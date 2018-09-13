import React from 'react'
import Preview from '../components/builder-preview.js'
import Bar from '../components/builder-bar.js'
import Helper from '../components/builder-helper.js'

export default class BuilderPage extends React.Component {
  state = {
    host: undefined,
    badgeURL: '',
    placeholder: ''
  }

  setBadgeURL = badgeURL => this.setState({ badgeURL })
  selectExample = exampleURL => this.setState({ badgeURL: exampleURL })

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
        <Bar host={host} badgeURL={badgeURL} placeholder={placeholder} onChange={this.setBadgeURL} />
        <Helper host={host} badgeURL={badgeURL} onSelect={this.selectExample} />
        <style jsx>{`
          div {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}
