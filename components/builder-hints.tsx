import * as CSS from 'csstype'

export default function BuilderHints ({ focus, badgeURL }) {
  const visible = !focus && !badgeURL
  const style: CSS.Properties = {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none'
  }
  return (
    <div className='hints' style={style}>
      <Hint left={0} width={50} height={3}>
        <div style={{ textAlign: 'left', marginBottom: '2em' }}>
          SERVICE_NAME (static badge / live badge)
        </div>
      </Hint>
      <Hint left={66} width={70} height={2}>TEXT</Hint>
      <Hint left={153} width={60} height={2}>TEXT</Hint>
      <Hint left={230} width={50} height={2}>
        &nbsp;RGB / <a href='/#colors'>COLOR_NAME</a> (optional)
      </Hint>
      <Hint left={290} width={110} height={1}>
        <a href='/#options'>OPTIONS (icon, label, etc.)</a>
      </Hint>
      <style jsx>{`
        .hints {
          height: 0;
          position: relative;
          overflow: visible;
          width: 100%;
          left: -147px;
          transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        a {
          color: #333;
        }
        a:hover {
          border-bottom: 1px dashed #333;
          text-decoration: none;
        }
      `}
      </style>
    </div>
  )
}

const Hint = ({ left, width, height, children, align = 'left' }) => {
  const wrapperPos: CSS.Properties = {
    left: `calc(50% + ${left}px)`,
    height: `${height * 54}px`,
    width: `${width}px`,
    textAlign: align as CSS.TextAlignProperty
  }
  return (
    <div className='hint' style={wrapperPos}>
      <div className='line' />
      <div className='content'>{children}</div>
      <style jsx>{`
        .hint {
          border-top: 2px solid #666;
          position: absolute;
        }
        .line {
          border-left: 2px solid #666;
          height: calc(100% - 26px);
          left: calc(50% - 1px);
          position: relative;
        }
        .content {
          min-width: 100%;
          text-align: center;
          position: absolute;
          bottom: 0;
          left: 0;
          white-space: nowrap;
          font: 16px/24px monospace;
          height: 24px;
          color: #333;
        }
      `}
      </style>
    </div>
  )
}
