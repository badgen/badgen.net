export default ({ data }) => {
  return data.map(({ id, title, examples }) => (
    <dl id={id} key={title}>
      <dt>
        { id
          ? <a className='title' href={`#${id}`}>{title}</a>
          : <span className='title'>{title}</span> }
        { id && <a className='doc' href={`/docs/${id}`}>?</a> }
      </dt>
      {
        Object.entries(examples).map(([path, desc]) => (
          <ExampleItem key={path} desc={desc} url={path} />
        ))
      }
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
          left: -0.8em;
          top: -0.1em;
          width: 0px;
        }
        a.doc {
          background: #CCC;
          text-align: center;
          color: #FFF; font: 12px/17px verdana, sans-serif;
          display: inline-block;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          margin-left: 0.5em;
          top: -1px;
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
      a {
        color: #06D;
      }
      a:hover {
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        span {
          display: none;
        }
      }
    `}</style>
  </dd>
)
