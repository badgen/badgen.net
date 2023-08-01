import BadgenTitle from './badgen-title'

const BadgePreview = ({ host, badgeURL, focus }) => {
  const showPreview = focus || !!badgeURL
  return (
    <div className='header-preview'>
      <div className={'title ' + (showPreview ? 'hidden' : 'show')}>
        <BadgenTitle host={host} />
      </div>
      <div className={'preview ' + (showPreview ? 'show' : 'none')}>
        <PreviewBadge badgePath={badgeURL} />
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
          pointer-events: none;
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

const PreviewBadge = ({ badgePath }) => {
  let src: string // the final badge image src path

  if (!badgePath) {
    src = '/static/%20/%20'
  } else if (badgePath.split('/').length > 2) {
    // if it looks like a valid badge path
    src = badgePath
  } else {
    src = `/static/%20/%20`
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <a href={src}><img alt={badgePath} style={{ height: '30px' }} src={src} /></a>
}

export default BadgePreview
