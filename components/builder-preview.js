import debounceRender from './libs/debounce-render.js'

const BadgePreview = ({ host = 'https://badgen.net/', badgeURL }) => {
  return (
    <div>
      <img src={genBadgeSrc(host, badgeURL)} />
      <style jsx>{`
        div {
          height: calc(50vh - 160px);
          display: flex;
          align-items: center;
        }
        img {
          height: 30px;
        }
      `}</style>
    </div>
  )
}

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

export default debounceRender(BadgePreview, 400)
