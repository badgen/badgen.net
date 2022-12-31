import Link from 'next/link'
import Image from 'next/image'

import { Merriweather } from '@next/font/google'

const merriweather = Merriweather({ subsets: ['latin'], weight: ["300", "700"] })

export default function BadgenTitle ({ host }) {
  return (
    <div className='title-block'>
      <div className={`title ${merriweather.className}`}>
        <h1>
          <Image alt='badgen logo' src='/static/badgen-logo.svg' width='42' height='42' />
          Badgen
          <StyleSwitch host={host} />
        </h1>
        <div>Fast badge generating service</div>
      </div>
      <style>{`
        .title-block {
          width: 100%;
          height: 260px;
          position: relative;
        }
        .title {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .title {
          transition: all 200ms ease-out;
        }
        .title.hidden {
          opacity: 0;
          transform: translateY(-20px);
        }
        .title.show {
          transition-delay: 100ms;
        }
        .title h1 {
          font: 46px/42px Merriweather, Georgia, serif;
          font-weight: 700;
          color: #333;
          height: 52px;
          width: 235px;
          position: relative;
        }
        .title h1 img {
          height: 42px;
          width: 42px;
          vertical-align: top;
          margin-top: -1px;
          margin-right: 10px;
        }
        .title div {
          font: 20px/32px Merriweather, Georgia, serif;
          font-weight: 300;
          letter-spacing: 0.3px;
          color: #333;
          margin-top: 10px;
        }
      `}
      </style>
    </div>
  )
}

const StyleSwitch = ({ host }) => {
  if (!host) return null

  return (
    <span className='style-switch'>
      {host.includes('https://flat.') ? [
        <Link key='2' href='https://flat.badgen.net'>FLAT</Link>,
        <Link key='1' href='https://badgen.net'>CLASSIC</Link>
      ] : [
        <Link key='1' href='https://badgen.net'>CLASSIC</Link>,
        <Link key='2' href='https://flat.badgen.net'>FLAT</Link>
      ]}
      <style>{`
        .style-switch {
          position: absolute;
          box-sizing: border-box;
          top: -2px;
          left: 235px;
          height: 26px;
          font: 16px/26px sans-serif;
          overflow: hidden;
        }
        a {
          color: #999;
          display: block;
          line-height: 26px;
          padding: 1px 3px;
        }
        a:first-child {
          margin-top: 0;
          transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .style-switch:hover a:first-child {
          margin-top: -26px;
        }
        a:focus {
          outline: none;
          color: #08C;
        }
      `}
      </style>
    </span>
  )
}
