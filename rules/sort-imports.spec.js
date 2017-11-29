'use strict';

const expect = require('expect')
const rule = require('./sort-imports.js')
const {
  RuleTester,
  Linter,
} = require('eslint')

const linter = new Linter()
linter.defineRules({
  'sort-imports': rule,
})
const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })
ruleTester.run('sort-imports', rule, {
  valid: [
    {
      code: [
        ``,
        `import a from 'a'`,
      ].join('\n'),
    },
    {
      code: [
        ``,
        `import a from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
      ].join('\n'),
    },
    {
      code: [
        ``,
        `import b from 'b'`,
        `import c from 'c'`,
        ``,
        `import a from 'a'`,
      ].join('\n'),
    },
    {
      code: [
        ``,
      ].join('\n'),
    },
  ],
  invalid: [
    {
      code: [
        ``,
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{message: 'import statements should be sorted'}],
    },
  ],
})

describe('sort-imports fixable', () => {
  it('should sort imports', () => {
    const before = [
      ``,
      `import c from 'c'`,
      `import a from 'a'`,
      `import b from 'b'`,
    ].join('\n')
    const expectedResult = [
      ``,
      `import a from 'a'`,
      `import b from 'b'`,
      `import c from 'c'`,
    ].join('\n')

    const messages = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'sort-imports': 'error' },
    })
    expect(messages.fixed).toBe(true)
    expect(messages.output).toEqual(expectedResult)
  })

  it('should handle import groups', () => {
    const before = [
      ``,
      `import c from 'c'`,
      `import a from 'a'`,
      `import b from 'b'`,
      ``,
      `import e from 'e'`,
      `import d from 'd'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import a from 'a'`,
      `import b from 'b'`,
      `import c from 'c'`,
      ``,
      `import d from 'd'`,
      `import e from 'e'`,
      ``,
    ].join('\n')

    const messages = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'sort-imports': 'error' },
    })
    expect(messages.fixed).toBe(true)
    expect(messages.output).toEqual(expectedResult)
  })

  it('should handle destructured import groups', () => {
    const before = [
      ``,
      `import c from 'c'`,
      `import {`,
      `  foo,`,
      `} from 'a'`,
      `import b from 'b'`,
      ``,
      `import e from 'e'`,
      `import d from 'd'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import {`,
      `  foo,`,
      `} from 'a'`,
      `import b from 'b'`,
      `import c from 'c'`,
      ``,
      `import d from 'd'`,
      `import e from 'e'`,
      ``,
    ].join('\n')

    const messages = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'sort-imports': 'error' },
    })
    expect(messages.fixed).toBe(true)
    expect(messages.output).toEqual(expectedResult)
  })
})
