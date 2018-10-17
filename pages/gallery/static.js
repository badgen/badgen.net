import React from 'react'
import GalleryHeader from '../../components/gallery-header.js'
import BadgeExamples from '../../components/badge-examples.js'
import staticExamples from '../../libs/examples-static.js'

export default class Gallery extends React.Component {
  render () {
    return (
      <div className='wrapper'>
        <GalleryHeader current='static' />
        <div className='content'>
          <BadgeExamples data={staticExamples} />
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
