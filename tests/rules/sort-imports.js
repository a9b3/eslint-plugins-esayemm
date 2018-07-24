'use strict'

const { map } = require('ramda')
const rule = require('../../lib/rules/sort-imports.js')
const { RuleTester, Linter } = require('eslint')
const { testVerifyAndFix } = require('../testUtils.js')

const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })

// ruleTester will test for valid and invalid outputs, not but if the rule will
// fix the code properly
ruleTester.run('sort-imports', rule, {
  valid: [
    {
      code: [``].join('\n'),
    },
    {
      code: [`import a from 'a'`].join('\n'),
    },
    {
      code: [
        `import a from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
      ].join('\n'),
    },
    {
      code: [
        `import {`,
        `  a,`,
        `} from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
      ].join('\n'),
    },
    {
      code: [
        `import b from 'b'`,
        `import c from 'c'`,
        ``,
        `import a from 'a'`,
      ].join('\n'),
    },
    {
      code: [
        `import d from './abc'`,
        `import e from './bcd'`,
        `import a from 'a'`,
        `import c from 'c'`,
      ].join('\n'),
    },
  ],
  invalid: [
    {
      code: [
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [
        { message: 'import statements should be sorted', line: 1 },
        { message: 'import statements should be sorted', line: 3 },
      ],
    },
    {
      code: [
        `import a from 'a'`,
        `import {`,
        `  c,`,
        `} from 'c'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'import statements should be sorted', line: 2 }],
    },
    {
      code: [
        `import a from 'a'`,
        `import c from 'c'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'import statements should be sorted', line: 2 }],
    },
    {
      code: [
        `import a from 'a'`,
        `import b from 'b'`,
        `import c from 'c'`,
        ``,
        `import e from 'e'`,
        `import d from 'd'`,
      ].join('\n'),
      errors: [{ message: 'import statements should be sorted', line: 5 }],
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
    map(testSortImports, [
      {
        input: [`import b from 'b'`, `import a from 'a'`].join('\n'),
        output: [`import a from 'a'`, `import b from 'b'`].join('\n'),
      },
      {
        input: [
          `import c from 'c'`,
          `import a from 'a'`,
          `import b from 'b'`,
        ].join('\n'),
        output: [
          `import a from 'a'`,
          `import b from 'b'`,
          `import c from 'c'`,
        ].join('\n'),
      },
      {
        input: [
          `import { something } from 'b'`,
          `import { `,
          `  a,`,
          `  b,`,
          `  c`,
          `} from 'a'`,
        ].join('\n'),
        output: [
          `import { `,
          `  a,`,
          `  b,`,
          `  c`,
          `} from 'a'`,
          `import { something } from 'b'`,
        ].join('\n'),
      },
      {
        input: [
          `import a from 'a'`,
          `import c from 'c'`,
          `import b from 'b'`,
          ``,
          `import e from 'e'`,
          `import d from 'd'`,
          `import f from 'f'`,
        ].join('\n'),
        output: [
          `import a from 'a'`,
          `import b from 'b'`,
          `import c from 'c'`,
          ``,
          `import d from 'd'`,
          `import e from 'e'`,
          `import f from 'f'`,
        ].join('\n'),
      },
      {
        input: [
          `import b from 'b'`,
          `import a from 'a'`,
          ``,
          `import c from 'c'`,
          `import d from 'd'`,
          ``,
          `import f from 'f'`,
          `import e from 'e'`,
        ].join('\n'),
        output: [
          `import a from 'a'`,
          `import b from 'b'`,
          ``,
          `import c from 'c'`,
          `import d from 'd'`,
          ``,
          `import e from 'e'`,
          `import f from 'f'`,
        ].join('\n'),
      },
    ])
  })
})
