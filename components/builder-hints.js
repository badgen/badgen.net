
export default ({ focus, badgeURL }) => {
  const visible = !focus && !badgeURL
  const style = {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none'
  }
  return (
    <div className='hints' style={style}>
      <Hint left={0} width={50} height={3}>
        "badge": default (static) badge generator
      </Hint>
      <Hint left={66} width={70} height={2}>TEXT</Hint>
      <Hint left={153} width={60} height={2}>TEXT</Hint>
      <Hint left={230} width={50} height={2}>&nbsp;RGB / COLOR_NAME (optional)</Hint>
      <Hint left={290} width={110} height={1}>More Options (icon, label, etc.)</Hint>
      <style jsx>{`
        .hints {
          height: 0;
          position: relative;
          overflow: visible;
          width: 100%;
          left: -147px;
          transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      `}</style>
    </div>
  )
}

const Hint = ({ left, width, height, children }) => {
  const wrapperPos = {
    left: `calc(50% + ${left}px)`,
    height: `${height * 54}px`,
    width: `${width}px`
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
          color: #333;
        }
      `}</style>
    </div>
  )
}
