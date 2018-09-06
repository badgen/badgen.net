import React from 'react'
import Preview from './badge-preview.js'
import TheBar from './the-bar.js'

export default class extends React.Component {
  state = {
    badgeURL: ''
  }

  setBadgeURL = badgeURL => this.setState({ badgeURL })

  render () {
    const { badgeURL } = this.state

    return (
      <div>
        <Preview badgeURL={badgeURL} />
        <TheBar badgeURL={badgeURL} onChange={this.setBadgeURL} />
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

const Helper = () => {
  return (
    <div>
      -
      <style jsx>{`
        div {
          height: 50vh;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
