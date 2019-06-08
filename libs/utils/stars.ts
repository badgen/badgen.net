export default (rating, max = 5) => {
  const base = Math.floor(rating)
  const fraction = rating - base

  const full = '★'.repeat(fraction < 0.66 ? base : base + 1)
  // TODO: update when Unicode 11 goes mainstream
  // between 0.33 and 0.66 should be `half star` symbol
  const half = fraction >= 0.33 && fraction <= 0.66 ? '★' : ''
  // @ts-ignore
  return (full + half).padEnd(max, '☆')
}
