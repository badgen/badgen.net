export default ({ host = 'https://badgen.net/', badgeURL }) => {
  return (
    <div>
      <img src={genBadgeSrc(host, badgeURL)} />
      <style jsx>{`
        div {
          height: 90px;
          text-align: center;
        }
        img {
          height: 30px;
          padding: 10px 0;
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
