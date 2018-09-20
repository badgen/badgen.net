import React from 'react'
import liveExamples from '../libs/examples-live.js'

export default class extends React.Component {
  state = { expanded: false }

  expand = () => this.setState({ expanded: !this.state.expanded })

  render () {
    return (
      <div className='wrapper'>
        <div className='ex-header'>
          <a id='examples' href='#examples' onClick={this.expand}>
            Badge Examples
          </a>
        </div>
        { this.state.expanded && <Examples data={liveExamples} /> }
        <style jsx>{`
          .wrapper {
            border-top: 1px solid #EEE;
            width: 100%;
          }
          .ex-header {
            height: 59px;
            line-height: 59px;
            padding: 0 1rem;
          }
          #examples {
            display: inline-block;
          }
        `}</style>
      </div>
    )
  }
}

const Examples = ({ data }) => {
  return Object.entries(data).map(([category, egs]) => (
    <dl key={category}>
      <dt>{category}</dt>
      { egs.map(eg => (
        <dd key={eg[1]}>
          <b>{eg[0]}</b>
          <i><img src={'https://badgen.net/' + eg[1]} /></i>
          <span><a href={eg[1]}>{'/' + eg[1]}</a></span>
        </dd>
      )) }
      <style jsx>{`
        dl {
          padding: 0 1em;
          margin: 0 auto;
          width: 920px;
        }
        dt {
          margin-bottom: 1em;
          padding-top: 1em;
          border-bottom: 1px solid #DDD;
          line-height: 2em;
        }
        dd {
          font: 14px/20px sans-serif;
          vertical-align: top;
          height: 28px;
          white-space: nowrap;
          margin: 0;
        }
        b {
          display: inline-block;
          min-width: 15em;
          font-family: Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
          text-align: right;
          font-weight: 300;
          color: #999;
        }
        i {
          display: inline-block;
          min-width: 210px;
        }
        img {
          vertical-align: top;
          height: 20px;
          margin: 0 10px;
        }
        span {
          font-family: monospace;
        }
      `}</style>
    </dl>
  ))
}
