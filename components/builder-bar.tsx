import React from 'react'

const DEFAULT_SIZE = 42

interface BuilderBarProps {
  placeholder: string;
  badgeURL: string;
  host?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export default class BuilderBar extends React.Component<BuilderBarProps> {
  shouldComponentUpdate ({ badgeURL }) {
    const url = badgeURL ? `#${badgeURL}` : window.location.pathname
    window.history.replaceState({}, document.title, url)
    return true
  }

  calcInputSize = url => {
    return url.length < DEFAULT_SIZE ? DEFAULT_SIZE : url.length
  }

  handleChange = ev => this.props.onChange(ev.target.value)

  render () {
    const { host, placeholder, badgeURL } = this.props
    const inputSize = this.calcInputSize(badgeURL)

    return (
      <label>
        <span className='left-host'>
          <span>{host}</span>
        </span>
        <input
          tabIndex={1}
          spellCheck={false}
          size={(inputSize || placeholder.length) + 1}
          placeholder={placeholder}
          onChange={this.handleChange}
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
          .left-host {
            display: inline-block;
            text-align: right;
            width: 234px;
          }
          .left-host > span {
            float: right;
            white-space: nowrap;
          }
          input {
            height: 24px;
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
            color: black;
            min-width: 526px;
          }
        `}
        </style>
      </label>
    )
  }
}
