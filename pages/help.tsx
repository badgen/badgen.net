import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'
import BadgenTitle from '../components/badgen-title'
import HelpInfo from '../components/help-info'
import Footer from '../components/footer'
import examples from '../public/.meta/badges.json'

export default function Index () {
  const [host, setHost] = useState('')

  useEffect(() => {
    const forceHost = new URL(window.location.href).searchParams.get('host')
    setHost((forceHost || window.location.origin) + '/')
  })

  return <>
    <Head>
      <title>Badgen: fast badge generating service</title>
      <meta name="description" content="fast badge generating service" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <BadgenTitle host={host} />
    <div className='body-wrapper'>
      <HelpInfo />
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
      .body-wrapper {
        padding-bottom: 6rem;
      }
    `}
    </style>
  </>  
}

function ColorBadge ({color: string}) {
  return <a href="/badge/color/blue/blue"><img src="/badge/color/blue/blue" alt="blue" /></a>
}
