import examples from '../libs/examples.js'

const examplesDB = Object.entries(examples).reduce((accu, curr) => {
  return accu.concat(curr[1].map(eg => eg.concat(curr[0])))
}, [])

export default ({ badgeURL, onClick }) => {
  const matched = badgeURL.length > 1 && examplesDB.filter(eg => {
    return eg.find(str => str.includes(badgeURL))
  })

  return (
    <div className='wrapper'>
      { matched && (
        <table><tbody>
          { matched.map(eg => (
            <Hint key={eg[1]} info={eg} onSelect={e => onClick(eg[1])} />
          )) }
        </tbody></table>
      )}
      <style jsx>{`
        .wrapper {
          height: 50vh;
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: auto;
        }
        table {
          min-width: 640px;
          margin: 0 auto;
          padding: 1em 0;
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
