'use strict'

const expect = require('expect')
const rule = require('../../lib/rules/sort-imports.js')
const { RuleTester, Linter } = require('eslint')
const { testVerifyAndFix } = require('../testUtils.js')

const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })

// ruleTester will test for valid and invalid outputs, not but if the rule will
// fix the code properly
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

// This section will test the rule to see if fixing works.
describe('sort-imports fixable', () => {
  const linter = new Linter()
  linter.defineRules({ 'sort-imports': rule })
  const testSortImports = testVerifyAndFix(linter, {
    parserOptions: { sourceType: 'module' },
    rules: { 'sort-imports': 'error' },
  })

  it('should sort imports', () => {
    testSortImports({
      input: [
        ``,
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
      ].join('\n'),
      output: [
        ``,
        `import a from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
      ].join('\n'),
    })
  })

  it('should handle import groups', () => {
    testSortImports({
      input: [
        ``,
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
        ``,
        `import e from 'e'`,
        `import d from 'd'`,
        ``,
      ].join('\n'),
      output: [
        ``,
        `import a from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
        ``,
        `import d from 'd'`,
        `import e from 'e'`,
        ``,
      ].join('\n'),
    })
  })

  it('should handle destructured import groups', () => {
    testSortImports({
      input: [
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
      ].join('\n'),
      output: [
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
      ].join('\n'),
    })
  })

  it('should handle paths', () => {
    testSortImports({
      input: [
        ``,
        `import c from 'abc/abc'`,
        `import b from 'abc/abc/abc'`,
        ``,
        `import e from 'mobx/me'`,
        `import d from 'abc/abc/abc/abc'`,
        `import ok from 'abc/abc/abc/ok'`,
        ``,
      ].join('\n'),
      output: [
        ``,
        `import c from 'abc/abc'`,
        `import b from 'abc/abc/abc'`,
        ``,
        `import d from 'abc/abc/abc/abc'`,
        `import ok from 'abc/abc/abc/ok'`,
        `import e from 'mobx/me'`,
        ``,
      ].join('\n'),
    })
  })

  it('should handle relative paths', () => {
    testSortImports({
      input: [
        ``,
        `import d from './abc'`,
        `import a from 'a'`,
        `import c from 'c'`,
        `import o from './bcd/ok'`,
        `import e from './bcd'`,
        ``,
      ].join('\n'),
      output: [
        ``,
        `import d from './abc'`,
        `import e from './bcd'`,
        `import o from './bcd/ok'`,
        `import a from 'a'`,
        `import c from 'c'`,
        ``,
      ].join('\n'),
    })
  })

  it('should handle imports between code', () => {
    testSortImports({
      intput: [
        ``,
        `import a from 'a'`,
        ``,
        `const testing = true`,
        ``,
        `import c from 'c'`,
        `import b from 'b'`,
        ``,
      ].join('\n'),
      output: [
        ``,
        `import a from 'a'`,
        ``,
        `const testing = true`,
        ``,
        `import b from 'b'`,
        `import c from 'c'`,
        ``,
      ].join('\n'),
    })
  })
})
