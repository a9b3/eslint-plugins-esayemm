'use strict'

module.exports = {
  configs: {
    recommended: {
      plugins: ['esayemm'],
      rules: {
        'esayemm/align-imports': 2,
        'esayemm/sort-imports': 2,
      },
    },
  },
  rules: {
    'align-imports': require('./rules/align-imports.js'),
    'sort-imports': require('./rules/sort-imports.js'),
  },
}
