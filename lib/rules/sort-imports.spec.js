'use strict'

const expect = require('expect')
const rule = require('./sort-imports.js')
const { RuleTester, Linter } = require('eslint')
const { lintTest } = require('./testUtils')

const linter = new Linter()
linter.defineRules({ 'sort-imports': rule })
const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })
ruleTester.run('sort-imports', rule, {
  valid: [
    {
      code: [``, `import a from 'a'`].join('\n'),
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
        `import d from './abc'`,
        `import e from './bcd'`,
        `import a from 'a'`,
        `import c from 'c'`,
      ].join('\n'),
    },
    {
      code: [``].join('\n'),
    },
  ],
  invalid: [
    {
      code: [
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'import statements should be sorted', line: 1 }],
    },
    {
      code: [
        `import a from 'a'`,
        `import c from 'c'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'import statements should be sorted', line: 2 }],
    },
  ],
})

describe('sort-imports fixable', () => {
  const testSortImports = lintTest(linter, 'sort-imports')

  it('should sort imports', () => {
    testSortImports(
      [``, `import c from 'c'`, `import a from 'a'`, `import b from 'b'`].join(
        '\n',
      ),
      [``, `import a from 'a'`, `import b from 'b'`, `import c from 'c'`].join(
        '\n',
      ),
    )
  })

  it('should handle import groups', () => {
    testSortImports(
      [
        ``,
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
        ``,
        `import e from 'e'`,
        `import d from 'd'`,
        ``,
      ].join('\n'),
      [
        ``,
        `import a from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
        ``,
        `import d from 'd'`,
        `import e from 'e'`,
        ``,
      ].join('\n'),
    )
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

  it('should handle paths', () => {
    const before = [
      ``,
      `import c from 'abc/abc'`,
      `import b from 'abc/abc/abc'`,
      ``,
      `import e from 'mobx/me'`,
      `import d from 'abc/abc/abc/abc'`,
      `import ok from 'abc/abc/abc/ok'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import c from 'abc/abc'`,
      `import b from 'abc/abc/abc'`,
      ``,
      `import d from 'abc/abc/abc/abc'`,
      `import ok from 'abc/abc/abc/ok'`,
      `import e from 'mobx/me'`,
      ``,
    ].join('\n')

    const messages = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'sort-imports': 'error' },
    })
    expect(messages.fixed).toBe(true)
    expect(messages.output).toEqual(expectedResult)
  })

  it('should handle relative paths', () => {
    const before = [
      ``,
      `import d from './abc'`,
      `import a from 'a'`,
      `import c from 'c'`,
      `import o from './bcd/ok'`,
      `import e from './bcd'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import d from './abc'`,
      `import e from './bcd'`,
      `import o from './bcd/ok'`,
      `import a from 'a'`,
      `import c from 'c'`,
      ``,
    ].join('\n')

    const messages = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'sort-imports': 'error' },
    })
    expect(messages.output).toEqual(expectedResult)
    expect(messages.fixed).toBe(true)
  })

  it('should handle imports between code', () => {
    const before = [
      ``,
      `import a from 'a'`,
      ``,
      `const testing = true`,
      ``,
      `import c from 'c'`,
      `import b from 'b'`,
      ``,
    ].join('\n')
    const expectedResult = [
      ``,
      `import a from 'a'`,
      ``,
      `const testing = true`,
      ``,
      `import b from 'b'`,
      `import c from 'c'`,
      ``,
    ].join('\n')

    const messages = linter.verifyAndFix(before, {
      parserOptions: { sourceType: 'module' },
      rules: { 'sort-imports': 'error' },
    })
    expect(messages.output).toEqual(expectedResult)
    expect(messages.fixed).toBe(true)
  })
})
