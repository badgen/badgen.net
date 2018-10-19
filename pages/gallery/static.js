import React from 'react'
import GalleryLayout from '../../components/gallery-layout.js'
import BadgeExamples from '../../components/badge-examples.js'
import staticExamples from '../../libs/examples-static.js'

export default class Gallery extends React.Component {
  render () {
    return (
      <GalleryLayout tab='static'>
        <BadgeExamples data={staticExamples} />
      </GalleryLayout>
    )
  }
}
