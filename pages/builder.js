import React from 'react'
import BadgeBuilder from '../components/badge-builder.js'

export default class extends React.Component {
  render () {
    return (
      <div>
        <BadgeBuilder />
        <style jsx>{`
          div {
            height: 100%;
          }
        `}</style>
      </div>
    )
  }
}
