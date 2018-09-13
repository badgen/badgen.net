import React, { Component } from 'react'
import debounce from 'lodash.debounce'

export default function debounceRender (ComponentToDebounce, ...debounceArgs) {
  return class DebouncedContainer extends Component {
    updateDebounced = debounce(this.forceUpdate, ...debounceArgs)

    shouldComponentUpdate () {
      this.updateDebounced()
      return false
    }

    componentWillUnmount () {
      this.updateDebounced.cancel()
    }

    render () {
      return <ComponentToDebounce {...this.props} />
    }
  }
}
