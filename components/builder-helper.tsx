import badgeList from '../static/.meta/badges.json'

const examples = [...badgeList.live, ...badgeList.static].reduce((accu, curr) => {
  return (accu as any).concat(Object.entries(curr.examples))
}, [] as [string, string][])

interface BuilderHelperProps {
  host?: string;
  badgeURL: string;
  onSelect: (value: string) => void;
}

export default function BuilderHelper ({ badgeURL, onSelect }: BuilderHelperProps) {
  if (badgeURL.length < 2) {
    return <div className='helper' />
  }

  const matched = examples.filter(eg => eg[0].includes(badgeURL))

  const hints = matched.length === 1 && matched[0][0] === '/' + badgeURL ? null : (
    <table>
      <tbody>
        {
          matched.map(eg => (
            <Hint
              key={eg[0]}
              info={eg}
              onSelect={e => onSelect(eg[0].replace(/^\//, ''))}
            />
          ))
        }
      </tbody>
    </table>
  )

  return (
    <div className='helper'>
      {hints}
      <style>{`
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

const Hint = ({ info, onSelect }) => (
  <tr onClick={onSelect}>
    <th>{info[1]}</th>
    <td>{info[0]}</td>
    <style>{`
      tr {
        font-size: 15px;
        line-height: 36px;
        cursor: default;
        white-space: nowrap;
        padding: 0 1em;
        vertical-align: baseline;
      }
      th {
        text-align: right;
        padding: 0 1em;
      }
      td {
        font-family: monospace;
      }
      td:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    `}
    </style>
  </tr>
)
