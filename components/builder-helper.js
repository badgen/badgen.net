import examplesLive from '../libs/examples-live.js'
import examplesStatic from '../libs/examples-static.js'

const egs = Object.entries({ ...examplesLive, ...examplesStatic })
  .reduce((accu, curr) => {
    return accu.concat(curr[1].map(eg => eg.concat(curr[0])))
  }, [])

export default ({ badgeURL, onSelect }) => {
  const matched = badgeURL.length > 1 && egs.filter(eg => {
    return eg.find(str => str.includes(badgeURL))
  })

  const hints = matched.length === 1 && matched[0][1] === '/' + badgeURL ? [] : matched

  return (
    <div className='helper'>
      { hints.length ? (
        <table><tbody>
          { hints.map(eg => (
            <Hint key={eg[1]} info={eg} onSelect={e => onSelect(eg[1].replace(/^\//, ''))} />
          )) }
        </tbody></table>
      ) : (
        ''
      )}
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
      `}</style>
    </div>
  )
}

const Hint = ({ info, onSelect }) => (
  <tr onClick={onSelect}>
    <th>{info[2]}</th>
    <td>{info[1]}</td>
    <style jsx>{`
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
    `}</style>
  </tr>
)
