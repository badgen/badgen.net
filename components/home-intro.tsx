import icons from 'badgen-icons'

export default function HomeIntro ({ isFlat = false }) {
  return (
  <div>
    <pre>{explainCode(isFlat)}</pre>

    <h3 id='colors'>Builtin color names</h3>
    {colorExamples()}

    <h3 id='icons'>Builtin icons</h3>
    {iconExamples()}

    <h3 id='options'>Options</h3>
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
    <style jsx>{`
      pre {
        font-size: 15px;
      }
      code {
        margin-right: 6px;
      }
    `}
    </style>
  </div>
)}

const colorExamples = () => {
  const colors = ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'pink', 'purple', 'grey', 'black']
  return colors.map(c => (
    <a href={`/badge/color/${c}/${c}`} key={c}>
      <img src={`/badge/color/${c}/${c}`} />
      <style jsx>{`
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
        <img src={url} />
        <style jsx>{`
          a {
            margin-right: 4px;
          }
        `}
        </style>
      </a>
    )
  })
}

const explainCode = (isFlat) => {
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
  } else {
    return text.trim()
  }
}
