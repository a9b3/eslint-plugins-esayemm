'use strict'

/**
 * Return a URI string for the meta.docs.url argument for an eslint rule.
 */
module.exports = function(ruleName) {
  return `https://github.com/esayemm/eslint-plugins-esayemm/tree/master/docs/rules/${ruleName}.md`
}
