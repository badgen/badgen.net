// import debounceRender from 'react-debounce-render'
import BadgenTitle from './badgen-title'

const BadgePreview = ({ host, badgeURL, focus }) => {
  const showPreview = focus || !!badgeURL
  return (
    <div className='header-preview'>
      <div className={'title ' + (showPreview ? 'hidden' : 'show')}>
        <BadgenTitle host={host} />
      </div>
      <div className={'preview ' + (showPreview ? 'show' : 'none')}>
        <PreviewBadge host={host} url={badgeURL} />
      </div>
      <style>{`
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
      `}
      </style>
    </div>
  )
}

/* const PreviewBadge = debounceRender(({ host, url }) => {
  return <img style={{ height: '30px' }} src={genBadgeSrc(host, url)} />
}, 300) */

const PreviewBadge = ({ host, url }) => {
  return <img alt={url} style={{ height: '30px' }} src={genBadgeSrc(host, url)} />
}

const genBadgeSrc = (host, url) => {
  if (!url) {
    return host + 'badge/%20/%20'
  }
  if (url.split('/').length > 2) {
    return host + url
  } else {
    return host + 'badge/%20/%20'
  }
}

export default BadgePreview
