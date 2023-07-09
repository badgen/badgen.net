/* eslint-disable @next/next/no-img-element */
import icons from 'badgen-icons'
import Image from 'next/image'
import BadgeList from '../public/.meta/badge-list.json'

// import { Open_Sans } from '@next/font/google'
// const openSans = Open_Sans({ subsets: ['latin'], weight: ['400'] })

export default function HomeIntro ({ isFlat = false }) {
  return (
  <div className={`help-info`}>
    <pre>{explainCode(isFlat)}</pre>

    <h3 id={'generators'}>Badge Generators</h3>
    <p>The detailed help for every badge generator.</p>
    <div className={'generator-list'}>
      {
        Object.keys(BadgeList).map(badge => {
          const href = '/' + badge
          return <a key={badge} href={href}><code>{href}</code></a>
        })
      }
    </div>

    <h3 id={'options'}>URL Options</h3>
    <ul>
      <li>
        <code>color</code>
        Override default badge color.
        &nbsp;<a href='/npm/dm/express?color=pink'>e.g.</a>
      </li>
      <li>
        <code>icon</code>
        Use builtin icon (or url for external icon) in front of subject text.
        &nbsp;<a href='/badge/docker/v1.2.3/blue?icon=docker'>e.g.</a>
      </li>
      <li className='deprecated'>
        <code>list</code>
        Set <code>list=|</code> will replace <code>,</code> with <code>|</code> in status text.
        &nbsp;<a href='/badge/platform/ios,macos,tvos?list=|'>e.g.</a>
      </li>
      <li>
        <code>label</code>
        Override default subject text (<a href='https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding'>URL-Encoding</a> needed for spaces or special characters).
        &nbsp;<a href='/badge/docker/v1.2.3/blue?label=container'>e.g.</a>
      </li>
      <li>
        <code>labelColor</code>
        Override default label color.
        &nbsp;<a href='/npm/dm/express?labelColor=pink'>e.g.</a>
      </li>
      <li>
        <code>scale</code>
        Custom badge scale.
        &nbsp;<a href='/badge/docker/v1.2.3/blue?icon=docker&scale=2'>e.g.</a>
      </li>
      <li>
        <code>cache</code>
        Live badge are cached in cdn for 24hrs (86400), you may limit it to a minimum of 5min (300).
        &nbsp;<a href='/npm/dm/express?cache=600'>e.g.</a>
      </li>
    </ul>

    <h3 id={'colors'}>Builtin Colors</h3>
    <p>The colors you can use with query param: <code>?color=[colorname]</code></p>

    { colorExamples() }

    <h3 id={'icons'}>Builtin Icons</h3>
    <p>The icons you can use with query param: <code>?icon=[iconname]</code></p>
    { iconExamples() }

    <h3>Advanced usage</h3>
    <ul>
      <li>
        <a href='/runkit'><code>/runkit</code></a>
        create arbitrary live badge with RunKit's online IDE.
      </li>
      <li>
        <a href='/https'><code>/https</code></a>
        turn an api endpoint into a svg live badge.
      </li>
    </ul>

    <style jsx>{`
      pre {
        font-size: 15px;
        font-family: Menlo, Courier New, monospace;
        font-weight: 300;
        background-color: #EEF2F8;
        padding: 20px;
      }
      code {
        margin-right: 6px;
      }
      .help-info h3 {
        font-size: 20px;
        font-family: Merriweather, serif;
        margin: 2em 0 1em 0;
        padding-top: 1em;
        font-weight: 400;
      }
      .help-info p {
        margin: 1rem 0;
      }

      ul { padding-left: 1em }
      p, li { vertical-align: top; margin: 1rem 0; color: #333 }
      code { padding: 0.3em 0.5em; display: pre; color: #333; background: #EEF2F8; font-size: 14px }
      a { display: inline; margin-right: 0.3em }
      a:hover { text-decoration: underline #06D; color: #06D }
      a code { color: #06D }

      .generator-list { display: flex; flex-wrap: wrap }
      .generator-list a { display: inline-block; margin-bottom: 0.6em }

      .deprecated { display: none }
    `}
    </style>
  </div>
)}

const colorExamples = () => {
  const colors = ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'pink', 'purple', 'grey', 'black']
  return colors.map(c => (
    <a href={`/badge/color/${c}/${c}?label=`} key={c}>
      <img alt={c} src={`/static/color/${c}/${c}?label=`} />
      <style>{`
        a {
          margin-right: 4px;
        }
      `}
      </style>
    </a>
  ))
}

const iconExamples = () => {
  return Object.keys(icons).map(icon => {
    const url = `/badge/icon/${icon}?icon=${icon}&label`
    return (
      <a href={url} key={icon}>
        <img alt={icon} src={url} />
        <style>{`
          a {
            margin-right: 4px;
          }
        `}
        </style>
      </a>
    )
  })
}

const explainCode = (isFlat: Boolean) => {
  const text = `
https://badgen.net/badge/:subject/:status/:color?icon=github
                   ──┬──  ───┬───  ──┬───  ──┬── ────┬──────
                     │       │       │       │       └─ Options (label, list, icon, color)
                     │       │       │       │
                     │      TEXT    TEXT    RGB / COLOR_NAME ( optional )
                     │
                  "badge" - default (static) badge generator`

  if (isFlat) {
    return text
      .replace('badgen.net', 'flat.badgen.net')
      .replace(/\n/g, '\n     ')
      .trim()
  }

  return text.trim()
}
