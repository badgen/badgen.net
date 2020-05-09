const assert = require('assert').strict

const chromeWebStore = require('chrome-webstore')

testUpstreams([
  chromeWebStoreVersion,
]).catch(err => {
  const { message, expected, actual } = err
  console.error({ message, expected, actual })
  process.exitCode = 1
})

async function testUpstreams (tests) {
  for (const test of tests) {
    await test()
  }
}

async function chromeWebStoreVersion () {
  const expected = '20200420'
  const actual = await chromeWebStore.version()

  assert.equal(actual, expected, 'Chrome Web Store api version is bumped')
}
