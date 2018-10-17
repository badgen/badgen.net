
export default ({ data }) => {
  return Object.entries(data).map(([category, egs]) => (
    <dl key={category}>
      <dt>{category}</dt>
      { egs.map(eg => (
        <ExampleItem key={eg[1]} desc={eg[0]} url={'/' + eg[1]} />
      )) }
      <style jsx>{`
        dl {
          padding: 0 1em;
          margin: 0 auto;
          max-width: 920px;
        }
        dt {
          margin-bottom: 1em;
          padding-top: 1em;
          border-bottom: 1px solid #DDD;
          line-height: 2em;
        }
      `}</style>
    </dl>
  ))
}

const ExampleItem = ({ desc, url }) => (
  <dd>
    <b>{desc}</b>
    <i><img src={url} /></i>
    <span><a href={url}>{url}</a></span>
    <style jsx>{`
      dd {
        font: 14px/20px sans-serif;
        vertical-align: top;
        height: 28px;
        white-space: nowrap;
        margin: 0;
      }
      b {
        display: inline-block;
        min-width: 14em;
        font-family: Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
        text-align: right;
        font-weight: 300;
        color: #999;
      }
      i {
        display: inline-block;
        min-width: 210px;
      }
      img {
        vertical-align: top;
        height: 20px;
        margin: 0 10px;
      }
      span {
        font-family: monospace;
      }
      @media (max-width: 600px) {
        span {
          display: none;
        }
      }
    `}</style>
  </dd>
)
