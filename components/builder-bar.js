import React from 'react'
import debounce from 'lodash.debounce'

export default class extends React.Component {
  state = {
    inputSize: this.props.placeholder.length
  }

  updateBadgeURL = debounce(this.props.onChange, 500)

  updateInputSize = url => {
    const defaultSize = this.props.placeholder.length
    if (url.length > defaultSize) {
      this.setState({ inputSize: url.length })
    } else {
      this.setState({ inputSize: defaultSize })
    }
  }

  onChange = ev => {
    this.updateInputSize(ev.target.value)
    this.updateBadgeURL(ev.target.value)
  }

  render () {
    const { host, placeholder } = this.props
    const { inputSize } = this.state

    return (
      <label>
        <span>{host}</span>
        <input
          tabIndex={1}
          size={(inputSize || placeholder.length) + 1}
          placeholder={placeholder}
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
