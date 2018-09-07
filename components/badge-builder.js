import React from 'react'
import Preview from './builder-preview.js'
import Bar from './builder-bar.js'
import Helper from './builder-helper.js'

export default class extends React.Component {
  state = {
    host: '',
    badgeURL: ''
  }

  setBadgeURL = badgeURL => this.setState({ badgeURL })

  componentDidMount () {
    this.setState({ host: window.location.origin })
  }

  render () {
    const { host, badgeURL } = this.state

    return (
      <div>
        <Preview badgeURL={badgeURL} />
        <Bar host={host} badgeURL={badgeURL} onChange={this.setBadgeURL} />
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
