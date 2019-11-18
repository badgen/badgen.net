import { useState, useEffect } from 'react'
import BadgeExamples from '../components/badge-examples'
import BadgenTitle from '../components/badgen-title'
// import TopBar from '../components/top-bar'
import Intro from '../components/home-intro'
import Footer from '../components/footer'
import examples from '../static/.meta/badges.json'

const Index = () => {
  const [tab, setTab] = useState('live')
  const [host, setHost] = useState()
  const badges = examples[tab]

  useEffect(() => {
    const forceHost = new URL(window.location.href).searchParams.get('host')
    setHost((forceHost || window.location.origin) + '/')
  })

  return <>
    <BadgenTitle host={host} />
    <div className='docs' style={{ width: '980px', margin: '0 auto' }}>
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
    `}
    </style>
  </> // eslint-disable-line
}

export default Index
