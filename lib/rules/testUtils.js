const { curry } = require('ramda')
const expect = require('expect')

const lintTest = curry((linter, rule, input, output) => {
  const messages = linter.verifyAndFix(input, {
    parserOptions: { sourceType: 'module' },
    rules: { 'sort-imports': 'error' },
  })
  expect(messages.fixed).toBe(true)
  expect(messages.output).toEqual(output)
})

module.exports = {
  lintTest,
}
