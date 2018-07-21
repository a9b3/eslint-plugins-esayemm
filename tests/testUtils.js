const { curry } = require('ramda')
const expect = require('expect')

const testVerifyAndFix = curry((linter, config, { input, output }) => {
  const messages = linter.verifyAndFix(input, config)
  expect(messages.fixed).toBe(true)
  expect(messages.output).toEqual(output)
})

module.exports = {
  testVerifyAndFix,
}
