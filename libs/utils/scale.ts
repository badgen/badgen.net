/**
 * Convert number to human readabel scale (color, grade, etc)
 */

const scale = (...args) => {
  if (args.length === 1 && typeof args[0] === 'string') {
    const preset = presets[args[0]]
    return presets && scale(...preset)
  }

  const [steps, results] = args

  if (steps.length !== results.length - 1) {
    throw Error('<results> length should be n + 1 for n <steps>.')
  }

  return value => results.slice([steps.findIndex(step => step > value)])[0]
}

const presets = {
  coverage: [
    [50, 75, 90, 95], ['red', 'orange', 'EEAA22', '99CC11', 'green']
  ]
}

export default scale
