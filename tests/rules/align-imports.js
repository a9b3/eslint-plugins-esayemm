'use strict'

const expect = require('expect')
const rule = require('../../lib/rules/align-imports.js')
const { RuleTester, Linter } = require('eslint')
const { testVerifyAndFix } = require('../testUtils.js')

const ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } })

// ruleTester will test for valid and invalid outputs, not but if the rule will
// fix the code properly
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

// This section will test the rule to see if fixing works.
describe('align-imports fixable', () => {
  const linter = new Linter()
  linter.defineRules({ 'align-imports': rule })
  const testAlignImports = testVerifyAndFix(linter, {
    parserOptions: { sourceType: 'module' },
    rules: { 'align-imports': 'error' },
  })

  it('should align', () => {
    testAlignImports({
      input: [``, `import b from 'b'`, `import {`, `  zed,`, `} from 'c'`].join(
        '\n',
      ),
      output: [
        ``,
        `import b from 'b'`,
        `import {`,
        `  zed,`,
        `}        from 'c'`,
      ].join('\n'),
    })
  })

  it('should align import groups', () => {
    testAlignImports({
      input: [``, `import b from 'b'`, ``, `import ab from 'ab'`, ``].join(
        '\n',
      ),
      output: [``, `import b  from 'b'`, ``, `import ab from 'ab'`, ``].join(
        '\n',
      ),
    })
  })

  it('should trim extra spaces', () => {
    testAlignImports({
      input: [
        ``,
        `import b          from 'b'`,
        ``,
        `import ab             from 'ab'`,
        ``,
      ].join('\n'),
      output: [``, `import b  from 'b'`, ``, `import ab from 'ab'`, ``].join(
        '\n',
      ),
    })
  })

  it('should align words with from', () => {
    testAlignImports({
      input: [
        ``,
        `import { fromJS } from 'b'`,
        ``,
        `import ab             from 'ab'`,
        ``,
      ].join('\n'),
      output: [
        ``,
        `import { fromJS } from 'b'`,
        ``,
        `import ab         from 'ab'`,
        ``,
      ].join('\n'),
    })
  })
})
