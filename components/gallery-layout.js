import React from 'react'
import GalleryHeader from './gallery-header.js'
import Footer from './footer.js'

export default class extends React.Component {
  render () {
    const { tab, children } = this.props
    return (
      <div>
        <GalleryHeader current={tab} />
        <div className='content'>
          {children}
        </div>
        <Footer />
        <style jsx>{`
          .content {
            padding: 3rem 0;
          }
        `}</style>
      </div>
    )
  }
}
