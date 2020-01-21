import ky from 'ky-universal'

export default ky.create({
  timeout: 3000,
  retry: 0
})
