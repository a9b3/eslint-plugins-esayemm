'use strict'

module.exports = {
  configs: {
    recommended: {
      plugins: ['esayemm'],
      rules: {
        'esayemm/align-imports': 'error',
        'esayemm/sort-imports': 'error',
      },
    },
  },
  rules: {
    'align-imports': require('./lib/rules/align-imports.js'),
    'sort-imports': require('./lib/rules/sort-imports.js'),
  },
}
