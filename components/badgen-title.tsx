import Link from 'next/link'
import Image from 'next/image'

// import { Merriweather } from '@next/font/google'

// const merriweather = Merriweather({ subsets: ['latin'], weight: ["300", "700"] })

export default function BadgenTitle ({ host }) {
  return (
    <div className='title-block'>
      <div className='title'>
        <h1>
          <Image className='badgen-icon' alt='badgen logo' src='/statics/badgen-logo.svg' width='42' height='42' />
          <span className='badgen-name'>Badgen</span>
          <StyleSwitch host={host} />
        </h1>
        <div>Fast badge generating service</div>
      </div>
      <style jsx>{`
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
          pointer-events: none;
        }
        .title.show {
          transition-delay: 100ms;
        }
        .title h1 {
          color: #333;
          height: 52px;
          width: 240px;
          position: relative;
        }
        .title .badgen-name {
          font: 50px/46px Merriweather, Georgia, serif;
          font-weight: 700;
          display: inline;
          margin-left: 5px;
          position: relative;
          top: -2px;
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
    <div className='style-switch'>
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
        .style-switch a {
          color: #999;
          display: block;
          line-height: 26px;
          padding: 1px 3px;
        }
        .style-switch a:first-child {
          margin-top: 0;
          transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .style-switch:hover a:first-child {
          margin-top: -26px;
        }
        .style-switch a:focus {
          outline: none;
          color: #08C;
        }
      `}
      </style>
    </div>
  )
}
