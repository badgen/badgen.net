import React from 'react'
import GalleryHeader from '../../components/gallery-header.js'
import BadgeExamples from '../../components/badge-examples.js'
import liveExamples from '../../libs/examples-live.js'

export default class Gallery extends React.Component {
  render () {
    return (
      <div className='wrapper'>
        <GalleryHeader current='live' />
        <div className='content'>
          <BadgeExamples data={liveExamples} />
        </div>
        <style jsx>{`
          .content {
            padding: 3rem 0;
          }
        `}</style>
      </div>
    )
  }
}
