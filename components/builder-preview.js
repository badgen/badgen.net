import debounceRender from './libs/debounce-render.js'

const BadgePreview = ({ host = 'https://badgen.net/', badgeURL, focus }) => {
  return (
    <div className='wrapper'>
      <div className={'title' + (focus ? ' focus' : '')}>
        <h1><img src='/static/badgen-logo.svg' /> Badgen</h1>
        <p>Fast badge generating service.</p>
      </div>
      <div className={'preview' + (focus ? ' focus' : '')}>
        <PreviewBadge host={host} url={badgeURL} />
      </div>
      <style jsx>{`
        .wrapper {
          height: calc(50vh - 100px);
          width: 100%;
          min-height: 100px;
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
        .title.focus {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 200ms ease-out;
        }
        .title img {
          height: 42px;
          width: 42px;
          vertical-align: top;
          margin-top: 2px;
        }
        .title h1 {
          margin: 1.5rem 0 0 0;
          font: 48px/48px Merriweather, serif;
          font-weight: 700;
          color: #333;
          height: 52px;
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
          transition-delay: 160ms;
        }
        .preview.focus {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
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
