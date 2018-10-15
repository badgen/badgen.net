import React from 'react'
import BadgeExamples from '../components/badge-examples.js'
import liveExamples from '../libs/examples-live.js'
import staticExamples from '../libs/examples-static.js'

export default class Gallery extends React.Component {
  state = {
    tab: 'live'
  }

  switch = () => this.setState({
    tab: this.state.tab === 'live' ? 'static' : 'live'
  })

  render () {
    const { tab } = this.state
    const egData = tab === 'live' ? liveExamples : staticExamples
    return (
      <div className='wrapper'>
        <div className='header'>
          <h1>Badgen Gallery</h1>
          <div className='tab' onClick={this.switch}>
            <a className={tab === 'live' ? 'current' : ''}>Live Badges</a>
            <a className={tab === 'static' ? 'current' : ''}>Static Badges</a>
          </div>
        </div>
        <div className='content'>
          <BadgeExamples data={egData} />
        </div>
        <style jsx>{`
          .header {
            background-color: #F7F7F7;
            text-align: center;
            padding: 5rem 0;
          }
          h1 {
            font: 3rem/5rem Merriweather, serif;
            letter-spacing: 1px;
            font-weight: 700;
            color: #333;
            margin: 0;
          }
          .tab {
            display: inline-block;
            border: 1px solid #333;
            margin-top: 1rem;
          }
          .tab a {
            display: inline-block;
            padding: 0 8px;
            color: #333;
            font: 14px/26px sans-serif;
            text-transform: uppercase;
          }
          .tab a:hover {
            cursor: pointer;
          }
          .tab a.current {
            color: #EEE;
            background-color: #333;
          }
          .content {
            padding: 3rem 0;
          }
        `}</style>
      </div>
    )
  }
}
