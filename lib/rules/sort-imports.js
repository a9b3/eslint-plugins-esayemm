'use strict'

const R = require('ramda')
const docUrl = require('../utils/docUrl.js')

const getImportGroups = R.compose(
  // Group imports by spacing.
  importNodes => {
    let groupedImports = [[importNodes[0]]]
    let groupedImportsIndex = 0

    for (let i = 1; i < importNodes.length; i++) {
      if (importNodes[i].range[0] - importNodes[i - 1].range[1] > 1) {
        groupedImportsIndex++
        groupedImports.push([])
      }
      groupedImports[groupedImportsIndex].push(importNodes[i])
    }

    return groupedImports
  },
  // Get all imports.
  R.filter(
    R.compose(
      R.equals('ImportDeclaration'),
      R.path(['type']),
    ),
  ),
)

module.exports = {
  meta: {
    docs: {
      description: 'Enforce alphabetized imports',
      category: 'Stylistic Issues',
      recommended: true,
      url: docUrl('sort-imports'),
    },
    fixable: 'code',
  },
  create: context => {
    const sourceCode = context.getSourceCode()
    return {
      Program: node => {
        const importGroups = getImportGroups(node.body)
        // Alphabetized each import group.
        const sortedImportGroups = R.map(
          R.sort((a, b) => a.source.value > b.source.value),
          importGroups,
        )

        // Flatten the import groups.
        const flatImportGroups = R.flatten(importGroups)
        const flatSortedImportGroups = R.flatten(sortedImportGroups)

        let i = 0
        let j = 0
        while (
          i < flatImportGroups.length &&
          j < flatSortedImportGroups.length
        ) {
          const originalNode = flatImportGroups[i]
          const sortedNode = flatSortedImportGroups[j]
          if (R.equals(originalNode, sortedNode)) {
            i++
            j++
            continue
          } else {
            flatImportGroups.splice(i, 1)
            i++
            context.report({
              node: originalNode,
              message: `import statements should be sorted`,
              fix(fixer) {
                return [
                  // remove range from previous node to current (this prevents
                  // newline not being removed)
                  fixer.removeRange([
                    R.path(['end'], sourceCode.getTokenBefore(sortedNode)) ||
                      sortedNode.start,
                    sortedNode.end,
                  ]),
                  fixer.insertTextBefore(
                    originalNode,
                    sourceCode.getText(sortedNode) + '\n',
                  ),
                ]
              },
            })
          }
        }
      },
    }
  },
}
