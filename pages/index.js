import { useState } from 'react'
import BadgeExamples from '../components/badge-examples.js'
import Header from '../components/home-header.js'
import Intro from '../components/home-intro.js'
import Footer from '../components/footer.js'
import examples from '../static/.gen/badges.json'

const Index = ({ badgeExamples }) => {
  const [ tab, setTab ] = useState('live')
  const badges = examples[tab]

  return <>
    <Header />
    <div className='docs'>
      <Intro />
      <h2 style={{ textAlign: 'center' }}>Badge Gallery</h2>

      <div className='tab-row'>
        <div className={`tab ${tab}`}>
          <a onClick={() => setTab('live')} className='live'>Live Badges</a>
          <a onClick={() => setTab('static')} className='static'>Static Badges</a>
        </div>
      </div>
      <BadgeExamples data={badges} />
    </div>
    <Footer />
    <style jsx>{`
      .docs {
        width: 960px;
        margin: 0 auto;
        padding-bottom: 6em;
      }
      p {
        text-align: center
      }

      .tab-row {
        text-align: center;
      }
      .tab {
        display: inline-block;
        border: 1px solid #333;
        margin-bottom: 2rem;
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
      .live a.live,
      .static a.static {
        color: #EEE;
        background-color: #333;
      }
    `}</style>
  </>
}

export default Index
