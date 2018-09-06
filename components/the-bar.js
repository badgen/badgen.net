import React from 'react'

export default class extends React.Component {
  onChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render () {
    const hostname = 'https://badgen.net/'
    const placeholder = 'badge/:subject/:status/:color'

    return (
      <label>
        <span>{hostname}</span>
        <input
          autoFocus
          placeholder={placeholder}
          size={placeholder.length}
          onChange={this.onChange}
        />
        <style jsx>{`
          label {
            height: 100px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F3F3F3;
          }
          div, span, input {
            font: 16px/24px monospace;
          }
          input {
            height: 24px;
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
          }
        `}</style>
      </label>
    )
  }
}
