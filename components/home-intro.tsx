import icons from 'badgen-icons'
import Image from 'next/image'

import { Open_Sans } from '@next/font/google'
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400'] })

export default function HomeIntro ({ isFlat = false }) {
  return (
  <div className={`home-intro ${openSans.className}`}>
    <pre>{explainCode(isFlat)}</pre>

    <h3>Options</h3>
    <ul>
      <li>
        <code>color</code>
        Override default badge color.
        <a href='/npm/dm/express?color=pink'>e.g.</a>
      </li>
      <li>
        <code>icon</code>
        Use builtin icon (or url for external icon) in front of subject text.
        <a href='/badge/docker/v1.2.3/blue?icon=docker'>e.g.</a>
      </li>
      <li>
        <code>list</code>
        Set <code>list=|</code> will replace <code>,</code> with <code>|</code> in status text.
        <a href='/badge/platform/ios,macos,tvos?list=|'>e.g.</a>
      </li>
      <li>
        <code>label</code>
        Override default subject text (<a href='https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding'>URL-Encoding</a> needed for spaces or special characters).
        <a href='/badge/docker/v1.2.3/blue?label=container'>e.g.</a>
      </li>
      <li>
        <code>labelColor</code>
        Override default label color.
        <a href='/npm/dm/express?labelColor=pink'>e.g.</a>
      </li>
      <li>
        <code>scale</code>
        Custom badge scale.
        <a href='/badge/docker/v1.2.3/blue?icon=docker&scale=2'>e.g.</a>
      </li>
      <li>
        <code>cache</code>
        Live badge are cached in cdn for 24hrs (86400), you may limit it to a minimum of 5min (300).
        <a href='/npm/dm/express?cache=600'>e.g.</a>
      </li>
    </ul>

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
    <style>{`
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
      .home-intro h3 {
        font-family: Merriweather, serif;
        margin: 2rem 0;
      }

      ul { padding-left: 2em; }
      li { vertical-align: top; font: 14px/32px menlo, sans-serif; color: #777 }
      li code { padding: 0.3em 0.5em; display: pre; color: #333; background: #EEF2F8 }
      li a { display: inline }
      a code { color: #06D }
    `}
    </style>
  </div>
)}

const colorExamples = () => {
  const colors = ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'pink', 'purple', 'grey', 'black']
  return colors.map(c => (
    <a href={`/badge/color/${c}/${c}`} key={c}>
      <Image alt={c} src={`/badge/color/${c}/${c}`} width='30' height='20' />
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
        <Image alt={icon} src={url} width='30' height='20' />
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
