
const WITH_DOCS = [
  'packagephobia',
  'uptime robot'
]

export default ({ data }) => {
  return Object.entries(data).map(([category, egs]) => (
    <dl id={category} key={category}>
      <dt>
        <a className='title' href={`#${category}`}>{category}</a>
        { WITH_DOCS.includes(category) && <a className='doc' href={`/docs/${category}`}>?</a> }
      </dt>
      { egs.map(eg => (
        <ExampleItem key={eg[1]} desc={eg[0]} url={eg[1]} />
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
        a {
          color: #333;
          position: relative;
          text-decoration: none;
          font-family: Merriweather, serif;
        }
        a.title:hover:before {
          content: '#';
          font-family: Arial;
          color: #ccc;
          display: inline-block;
          position: relative;
          width: 0px;
          left: -0.8em;
        }
        a.doc {
          background: #CCC;
          text-align: center;
          color: #FFF; font: 12px/17px verdana, sans-serif;
          display: inline-block;
          height: 16px;
          width: 16px;
          border-radius: 50%;
        }
        a.doc {
          margin-left: 0.5em;
        }
        a.doc:hover {
          background-color: #AAA
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
