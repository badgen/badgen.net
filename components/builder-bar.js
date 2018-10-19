import React from 'react'

const DEFAULT_SIZE = 42

export default class extends React.Component {
  calcInputSize = url => {
    return url.length < DEFAULT_SIZE ? DEFAULT_SIZE : url.length
  }

  onChange = ev => this.props.onChange(ev.target.value)

  render () {
    const { host, placeholder, badgeURL } = this.props
    const inputSize = this.calcInputSize(badgeURL)

    return (
      <label>
        <span>{host}</span>
        <input
          tabIndex={1}
          size={(inputSize || placeholder.length) + 1}
          placeholder={placeholder}
          onChange={this.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          value={badgeURL}
        />
        <style jsx>{`
          label {
            height: 100px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F3F3F3;
            overflow-x: auto;
            cursor: text;
          }
          span, input {
            font: 16px/24px monospace;
          }
          span {
            display: inline-block;
            text-align: right;
            width: 234px;
          }
          input {
            height: 24px;
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
            color: black;
            width: 526px;
          }
        `}</style>
      </label>
    )
  }
}
