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
    'align-imports': require('./rules/align-imports.js'),
    'sort-imports': require('./rules/sort-imports.js'),
  },
}
