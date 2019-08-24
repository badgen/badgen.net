const TopBar = () => {
  return (
    <div className="topbar">
      <div className="navs">
        <a href="https://badgen.net">CLASSIC STYLE</a>
        <a href="https://flat.badgen.net">FLAT STYLE</a>
        <a href="/builder">BADGE BUILDER</a>
      </div>
      <div className="news">
        <a href="https://opencollective.com/badgen">
          Consider donating to help us sustain our service ❤️
        </a>
      </div>
      <style jsx>{`
        .topbar {
          height: 50px;
          line-height: 50px;
          padding: 0 0.5em;
          display: grid;
          grid-template-columns: 1fr 460px;
        }
        .navs {
          letter-spacing: 0.04em;
        }
        .news {
          text-align: right;
        }
        a {
          display: inline-block;
          font-size: 14px;
          margin: 0 1em;
          color: #777;
        }
      `}</style>
    </div>
  )
}

export default TopBar
