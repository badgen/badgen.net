import React from 'react'

export default class extends React.Component {
  calcInputSize = url => {
    const defaultSize = this.props.placeholder.length
    return url.length < defaultSize ? defaultSize : url.length
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
          }
          span, input {
            font: 16px/24px monospace;
          }
          span {
            display: inline-block;
            text-align: right;
          }
          input {
            height: 24px;
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
            color: black;
          }
        `}</style>
      </label>
    )
  }
}
