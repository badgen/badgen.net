/* eslint-disable @next/next/no-html-link-for-pages */
import * as CSS from 'csstype'
import Link from 'next/link'

export default function BuilderHints ({ focus, badgeURL }) {
  const visible = !focus && !badgeURL
  const style: CSS.Properties = {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none'
  }
  return (
    <div className='hints' style={style}>
      <Hint left={0} width={50} height={3}>
        <a href='/help#generators'>GENERATOR (static or live badge)</a>
      </Hint>
      <Hint left={66} width={70} height={2}>TEXT</Hint>
      <Hint left={153} width={60} height={2}>TEXT</Hint>
      <Hint left={230} width={50} height={2}>
        <a href='/help#colors'>COLOR (optional)</a>
      </Hint>
      <Hint left={290} width={110} height={1}>
        <a className='sd' href='/help#options'>OPTIONS (icon, label, etc.)</a>
      </Hint>
      <style jsx>{`
        .hints {
          position: relative;
          overflow: visible;
          width: 100%;
          left: -147px;
          /* height: 200px; */
          transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .hint a {
          color: #333;
        }
        a:hover {
          border-bottom: 1px dashed #333 !important;
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
    textAlign: align as CSS.Property.TextAlign
  }
  return (
    <div className='hint' style={wrapperPos}>
      <div className='line' />
      <div className='content'>{children}</div>
      <style>{`
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
