import Link from 'next/link'

export default ({ current }) => {
  return (
    <header>
      <h1>Badgen Gallery</h1>
      <div className={`tab ${current}`}>
        <Link href='/gallery/live'>
          <a className='live'>Live Badges</a>
        </Link>
        <Link href='/gallery/static'>
          <a className='static'>Static Badges</a>
        </Link>
      </div>
      <style jsx>{`
        header {
          background-color: #F7F7F7;
          text-align: center;
          padding: 5rem 0;
        }
        h1 {
          font: 3rem/5rem Merriweather, serif;
          letter-spacing: 1px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
        .tab {
          display: inline-block;
          border: 1px solid #333;
          margin-top: 1rem;
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
      `}</style>
    </header>
  )
}
