export default ({ children, ...args }) => (
  <div {...args}>
    {children}
    <style jsx>{`
      div {
        margin: 0 20px;
      }
    `}</style>
    <style jsx global>{`
      @import url('/static/doc-styles.css')
    `}</style>
  </div>
)
