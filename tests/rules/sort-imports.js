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
        `import a from 'a'`,
        `import c from 'c'`,
        ``,
        `import d from './abc'`,
        `import e from './bcd'`,
      ].join('\n'),
    },
    {
      code: [
        `import a from 'a'`,
        `import c from 'c'`,
        ``,
        `import d from './abc'`,
        `import e from './bcd'`,
        `import 'what'`,
      ].join('\n'),
    },
  ],
  invalid: [
    {
      code: [`import b from 'b'`, `const x = 'hi'`, `import c from 'c'`].join(
        '\n',
      ),
      errors: [
        { message: 'imports must be grouped and sorted', line: 1 },
        { message: 'imports should be at the top of file', line: 3 },
      ],
    },
    {
      code: [
        `import c from 'c'`,
        `import a from 'a'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'imports must be grouped and sorted', line: 1 }],
    },
    {
      code: [
        `import a from 'a'`,
        `import {`,
        `  c,`,
        `} from 'c'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'imports must be grouped and sorted', line: 1 }],
    },
    {
      code: [
        `import a from 'a'`,
        `import c from 'c'`,
        `import b from 'b'`,
      ].join('\n'),
      errors: [{ message: 'imports must be grouped and sorted', line: 1 }],
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
        input: [
          `import b from 'b'`,
          `import {`,
          `  aa,`,
          `  bb,`,
          `  cc,`,
          `} from 'a'`,
          `import c from 'c'`,
        ].join('\n'),
        output: [
          `import { aa, bb, cc } from 'a'`,
          `import b from 'b'`,
          `import c from 'c'`,
        ].join('\n'),
      },
      {
        input: [
          `import a from 'a'`,
          `const x = 'hi'`,
          `import b from 'b'`,
        ].join('\n'),
        output: [
          `import a from 'a'`,
          `import b from 'b'`,
          `const x = 'hi'`,
        ].join('\n'),
      },
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
          `import { a, b, c } from 'a'`,
          `import { something } from 'b'`,
        ].join('\n'),
      },
      {
        input: [
          `import { something } from 'b'`,
          `import 'zed'`,
          `import { `,
          `  a,`,
          `  b,`,
          `  c`,
          `} from 'a'`,
        ].join('\n'),
        output: [
          `import { a, b, c } from 'a'`,
          `import { something } from 'b'`,
          `import 'zed'`,
        ].join('\n'),
      },
      {
        input: [
          `import { something } from 'b'`,
          `import 'zed'`,
          `import Foo, { `,
          `  a,`,
          `  b,`,
          `  c`,
          `} from 'a'`,
        ].join('\n'),
        output: [
          `import Foo, { a, b, c } from 'a'`,
          `import { something } from 'b'`,
          `import 'zed'`,
        ].join('\n'),
      },
    ])
  })
})
