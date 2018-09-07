import React from 'react'
import debounce from 'lodash.debounce'

export default class extends React.Component {
  state = {
    inputSize: 29,
    placeholder: 'badge/:subject/:status/:color'
  }

  updateBadgeURL = debounce(this.props.onChange, 500)

  updateInputSize = url => {
    const defaultSize = this.state.placeholder.length
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
    const { host = 'https://badgen.net' } = this.props
    const { inputSize, placeholder } = this.state

    return (
      <label>
        <span>{host}/</span>
        <input
          autoFocus
          size={inputSize}
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
            min-width: 240px;
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
