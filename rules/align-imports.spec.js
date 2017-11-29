'use strict';

const expect = require('expect')
const rule = require('./align-imports.js')
const {
  RuleTester,
  Linter,
} = require('eslint')

const linter = new Linter()
linter.defineRules({
  'align-imports': rule,
})
const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })
ruleTester.run('align-imports', rule, {
  valid: [
    {
      code: [
        ``,
      ].join('\n'),
    },
    {
      code: [
        ``,
        `import foo from 'foo'`,
      ].join('\n'),
    },
    {
      code: [
        ``,
        `import foo from 'foo'`,
        `import b   from 'b'`,
        `import {`,
        `  zed,`,
        `}          from 'c'`,
      ].join('\n'),
    },
  ],
  invalid: [
    {
      code: [
        ``,
        `import foo from 'foo'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{message: 'import statements should be aligned'}],
    },
    {
      code: [
        ``,
        `import b from 'b'`,
        `import {`,
        `  zed,`,
        `} from 'c'`,
      ].join('\n'),
      errors: [{message: 'import statements should be aligned'}],
    },
  ],
})

describe('align-imports fixable', () => {
  it('should align', () => {
    const before = [
      ``,
      `import b from 'b'`,
      `import {`,
      `  zed,`,
      `} from 'c'`,
    ].join('\n')
    const expectedResult = [
      ``,
      `import b from 'b'`,
      `import {`,
      `  zed,`,
      `}        from 'c'`,
    ].join('\n')

    const { output } = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'align-imports': 'error' },
    })
    expect(output).toEqual(expectedResult)
  })

  it('should align', () => {
    const before = [
      ``,
      `import b from 'b'`,
      ``,
      `import ab from 'ab'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import b  from 'b'`,
      ``,
      `import ab from 'ab'`,
      ``,
    ].join('\n')

    const { output } = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'align-imports': 'error' },
    })
    expect(output).toEqual(expectedResult)
  })
})
