import Link from 'next/link'
import debounceRender from 'react-debounce-render'

const BadgePreview = ({ host, badgeURL, focus }) => {
  const showPreview = focus || !!badgeURL
  return (
    <div className='header-preview'>
      <div className={'title ' + (showPreview ? 'hidden' : 'show')}>
        <h1>
          <img src='/static/badgen-logo.svg' />
          Badgen
          <StyleSwitch host={host} />
        </h1>
        <p>Fast badge generating service.</p>
      </div>
      <div className={'preview ' + (showPreview ? 'show' : 'none')}>
        <PreviewBadge host={host} url={badgeURL} />
      </div>
      <style jsx>{`
        .header-preview {
          height: calc(50vh - 100px);
          width: 100%;
          min-height: 160px;
          position: relative;
        }
        .title, .preview {
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
        .title img {
          height: 42px;
          width: 42px;
          vertical-align: top;
          margin-top: 2px;
          margin-right: 10px;
        }
        .title h1 {
          margin: 1.5rem 0 0 0;
          font: 48px/48px Merriweather, serif;
          font-weight: 700;
          color: #333;
          height: 52px;
          width: 235px;
          position: relative;
        }
        .title p {
          font: 19px/32px Merriweather, serif;
          font-weight: 300;
          letter-spacing: 0.3px;
          color: #333;
        }
        .preview {
          pointer-events: none;
          opacity: 0;
          transform: translateY(30px);
          transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .preview.show {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 180ms;
        }
      `}</style>
    </div>
  )
}

const StyleSwitch = ({ host }) => {
  if (!host) return null

  return (
    <span className='style-switch'>
      { host.includes('https://flat.') ? [
        <Link key='2' href='https://flat.badgen.net'><a>FLAT</a></Link>,
        <Link key='1' href='https://badgen.net'><a>CLASSIC</a></Link>
      ] : [
        <Link key='1' href='https://badgen.net'><a>CLASSIC</a></Link>,
        <Link key='2' href='https://flat.badgen.net'><a>FLAT</a></Link>
      ] }
      <style jsx>{`
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
      `}</style>
    </span>
  )
}

const PreviewBadge = debounceRender(({ host, url }) => {
  return <img style={{ height: '30px' }} src={genBadgeSrc(host, url)} />
}, 400)

const genBadgeSrc = (host, url) => {
  if (url === '') {
    return host + 'badge///blue'
  }
  if (url.split('/').length > 2) {
    return host + url
  } else {
    return host + 'badge///blue'
  }
}

export default BadgePreview
