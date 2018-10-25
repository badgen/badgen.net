import React from 'react'
import GalleryLayout from '../../components/gallery-layout.js'
import BadgeExamples from '../../components/badge-examples.js'
import liveExamples from '../../libs/examples-live.js'

export default class Gallery extends React.Component {
  render () {
    return (
      <GalleryLayout tab='live'>
        <BadgeExamples data={liveExamples} />
      </GalleryLayout>
    )
  }
}
