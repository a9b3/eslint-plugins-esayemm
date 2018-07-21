'use strict'

const expect = require('expect')
const rule = require('./align-imports.js')
const { RuleTester, Linter } = require('eslint')

const linter = new Linter()
linter.defineRules({ 'align-imports': rule })
const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })

ruleTester.run('align-imports', rule, {
  valid: [
    { code: `` },
    {
      code: `import foo from 'foo'`,
    },
    {
      code: [`import 'foo'`, `import 'barbar'`].join('\n'),
    },
    {
      code: [
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
      code: [`import foo from 'foo'`, `import b from 'b'`].join('\n'),
      errors: [{ message: 'import statements should be aligned', line: 2 }],
    },
    {
      code: [`import b from 'b'`, `import {`, `  zed,`, `} from 'c'`].join(
        '\n',
      ),
      errors: [{ message: 'import statements should be aligned', line: 2 }],
    },
  ],
})

describe('align-imports fixable', () => {
  const linterConfig = {
    parserOptions: { sourceType: 'module' },
    rules: { 'align-imports': 'error' },
  }

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

    const { output } = linter.verifyAndFix(before, linterConfig)
    expect(output).toEqual(expectedResult)
  })

  it('should align import groups', () => {
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

    const { output } = linter.verifyAndFix(before, linterConfig)
    expect(output).toEqual(expectedResult)
  })

  it('should trim extra spaces', () => {
    const before = [
      ``,
      `import b          from 'b'`,
      ``,
      `import ab             from 'ab'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import b  from 'b'`,
      ``,
      `import ab from 'ab'`,
      ``,
    ].join('\n')

    const { output } = linter.verifyAndFix(before, linterConfig)
    expect(output).toEqual(expectedResult)
  })

  it('should align words with from', () => {
    const before = [
      ``,
      `import { fromJS } from 'b'`,
      ``,
      `import ab             from 'ab'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import { fromJS } from 'b'`,
      ``,
      `import ab         from 'ab'`,
      ``,
    ].join('\n')

    const { output } = linter.verifyAndFix(before, linterConfig)
    expect(output).toEqual(expectedResult)
  })
})
