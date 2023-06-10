import badgeList from '../public/.meta/badge-list.json'
import badgeListLegacy from '../public/.meta/badges.json'

// const examples = [...badgeList.live, ...badgeList.static].reduce((accu, curr) => {
//   return (accu as any).concat(Object.entries(curr.examples))
// }, [] as [string, string][])

type BadgeExamples = {
  [pathname: string]: string
}
type BadgeList = {
  [id: string]: {
    title: string;
    examples: BadgeExamples;
  }
}


const examples = extractExampleList(badgeList)

function extractExampleList (badgeList: BadgeList): BadgeExamples {
  let examples = {}

  Object.entries(badgeList).forEach((x) => {
    examples = { ...examples, ...x[1].examples }
  })

  // Also apply legacy examples
  badgeListLegacy.live.forEach((x) => {
    examples = { ...examples, ...x.examples }
  })

  return examples
}

interface BuilderHelperProps {
  host?: string;
  badgeURL: string;
  onSelect: (value: string) => void;
}

export default function BuilderHelper ({ badgeURL, onSelect }: BuilderHelperProps) {
  if (badgeURL.length < 2) {
    return <div className='helper' />
  }

  const matched = Object.entries(examples).filter(eg => eg[0].includes(badgeURL))

  const hints = matched.length === 1 && matched[0][0] === '/' + badgeURL ? null : (
      <div className='suggestions'>
        {
          matched.map(eg => (
            <dl key={eg[0]} onClick={e => onSelect(eg[0].replace(/^\//, ''))}>
              <dt>{eg[1]}</dt>
              <dd>{eg[0]}</dd>
            </dl>
          ))
        }
        <style jsx>{`
          .suggestions { padding-top: 10px; }
          dl {
            font-size: 14px;
            line-height: 36px;
            cursor: default;
            white-space: nowrap;
            display: flex;
          }
          dt { font-weight: bold; width: 300px; overflow: visible; text-align: right }
          dd { margin-left: 20px; width: 640px; overflow: visible; font-family: menlo, monospace; }
          dd:hover { cursor: pointer; text-decoration: underline }
        `}</style>
      </div>
  )

  return (
    <div className='helper'>
      {hints}
      <style jsx>{`
        .helper {
          height: 50vh;
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: auto;
        }
        table {
          min-width: 640px;
          margin: 0 auto;
          padding: 1.2em 0;
        }
      `}
      </style>
    </div>
  )
}
