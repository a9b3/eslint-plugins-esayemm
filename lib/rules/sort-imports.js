'use strict'

const fs = require('fs')
const path = require('path')
const R = require('ramda')
const docUrl = require('../utils/docUrl.js')

/**
 * Get the imports at the top of the file and the rest of the file in separate
 * arrays.
 */
function getTopOfFileImports(node) {
  let encounteredNonImports = false
  let topOfFileImports = []
  let otherImports = []
  for (let curNode of node.body) {
    // Only apply changes to ImportDeclaration's with specifiers
    if (curNode.type === 'ImportDeclaration' && curNode.specifiers.length > 0) {
      if (!encounteredNonImports) {
        topOfFileImports.push(curNode)
      } else {
        otherImports.push(curNode)
      }
    } else {
      encounteredNonImports = true
    }
  }

  return {
    topOfFileImports,
    otherImports,
  }
}

/**
 * Returns an ImportDeclaration with sorted specifiers.
 * Note that this does not dedupe specifiers, autofix should not handle that
 * because there could be cases when the user has different imported names for
 * the same local name in that case we cannot definitively rule out which one to
 * delete.
 *
 * ImportDeclaration -> ImportDeclaration
 */
const sortSpecifiers = R.curry(node =>
  R.merge(node, {
    specifiers: R.sort(R.ascend(R.path(['local', 'name'])))(node.specifiers),
  }),
)

/**
 * Merge ImportDeclarations with the same source as well as sort the specifiers
 *
 * [ImportDeclaration] -> [ImportDeclaration]
 */
const dedupeImportSources = R.compose(
  R.flatten,
  // Merge the multiple ImportDeclarations with the same source's specifiers.
  // [[ ImportDeclaration ]] -> [ImportDeclaration]
  R.map(
    // [ImportDeclaration] -> ImportDeclaration
    R.compose(
      sortSpecifiers,
      // merge specifiers
      R.reduce(
        R.mergeWithKey((k, l, r) => (k === 'specifiers' ? R.concat(l, r) : r)),
        {},
      ),
    ),
  ),
  R.values,
  R.groupBy(R.path(['source', 'value'])),
)

const GROUP_IMPORTS = {
  local: a => {
    return fs.existsSync(path.resolve(a.source.value))
  },
  relative: a => {
    return /^\./.test(a.source.value)
  },
}

/**
 * Group ImportDeclaration by their source, then within each group sort by
 * source.
 *
 * [ImportDeclaration] -> [[ImportDeclaration]]
 */
const groupImportsBySource = R.compose(
  R.map(R.sort(R.ascend(R.path(['source', 'value'])))),
  importMap => {
    return [
      importMap.globalOrModule,
      importMap.local,
      importMap.relative,
    ].filter(Boolean)
  },
  R.groupBy(node => {
    return GROUP_IMPORTS.local(node)
      ? 'local'
      : GROUP_IMPORTS.relative(node)
        ? 'relative'
        : 'globalOrModule'
  }),
)

/**
 * Return desired output string for an import specifier.
 */
const importSpecifierToText = specifier =>
  specifier.imported && specifier.imported.name !== specifier.local.name
    ? `${specifier.imported.name} as ${specifier.local.name}`
    : specifier.local.name

/**
 * Return desired output string for an array of arrays of ImportDeclarations.
 *
 * [[ImportDeclaration]] -> string
 */
const generateDesiredOutputText = R.compose(
  R.join('\n\n'),
  R.map(
    R.compose(
      R.join('\n'),
      R.map(node => {
        const grouped = R.groupBy(R.path(['type']), node.specifiers)

        const defaultImports = grouped.ImportDefaultSpecifier
          ? grouped.ImportDefaultSpecifier.map(importSpecifierToText).join(', ')
          : ''
        const imports = grouped.ImportSpecifier
          ? '{ ' +
            grouped.ImportSpecifier.map(importSpecifierToText).join(', ') +
            ' }'
          : ''

        const combinedOutputString = [defaultImports, imports]
          .filter(Boolean)
          .join(', ')

        return `import ${combinedOutputString} from '${node.source.value}'`
      }),
    ),
  ),
)

/**
 * This can be used with fixer.removeRange to make sure we are removing the
 * newlines in between nodes.
 */
function getRemoveRange(sourceCode, node) {
  return [
    R.path(['end'], sourceCode.getTokenBefore(node)) || node.start,
    R.path(['start'], sourceCode.getTokenAfter(node)) || node.end,
  ]
}

/**
 * Return the range [start, end] of an array of nodes.
 *
 * [node] -> [number, number]
 */
const getNodesRange = nodes => [nodes[0].range[0], R.last(nodes).range[1]]

const getNodesLoc = nodes => ({
  start: nodes[0].loc.start,
  end: R.last(nodes).loc.end,
})

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

    // These are the responsibilities of this rule.
    // - no duplicate import source
    // - imports should be grouped by source
    // - imports should be sorted by source within group
    return {
      'Program:exit': node => {
        const { topOfFileImports, otherImports } = getTopOfFileImports(node)

        const sortedImportGroups = R.compose(
          groupImportsBySource,
          dedupeImportSources,
        )(R.concat(topOfFileImports, otherImports))

        // Only report error if sortedImportGroups is not the same as
        // topOfFileImports.
        if (!R.equals(R.flatten(sortedImportGroups), topOfFileImports)) {
          context.report({
            fix: fixer =>
              fixer.replaceTextRange(
                getNodesRange(topOfFileImports),
                generateDesiredOutputText(sortedImportGroups),
              ),
            message: 'imports must be grouped and sorted',
            loc: getNodesLoc(topOfFileImports),
          })
        }

        otherImports.map(node => {
          context.report({
            fix: fixer => fixer.removeRange(getRemoveRange(sourceCode, node)),
            message: 'imports should be at the top of file',
            node,
          })
        })
      },
    }
  },
}
