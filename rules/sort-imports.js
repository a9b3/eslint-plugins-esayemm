'use strict'

module.exports = {
  meta: {
    fixable: 'code',
  },
  create: context => {
    const sourceCode = context.getSourceCode()

    return {
      Program: node => {
        const importNodes = node.body.filter(n => n.type === 'ImportDeclaration')
        const importNodeGroup = importNodes.reduce((arr, n) => {
          const prevNode = arr[arr.length - 1] && arr[arr.length - 1][arr[arr.length - 1].length - 1]
          if (!prevNode) {
            arr.push([n])
            return arr
          } else if (n.start - prevNode.end > 1) {
            arr.push([n])
            return arr
          }
          arr[arr.length - 1].push(n)
          return arr
        }, [])

        // check if its already sorted
        const isSorted = importNodeGroup.every(g => {
          for (let i = 0; i < g.length-1; i++) {
            if (g[i+1].source.value <= g[i].source.value) {
              return false
            }
          }
          return true
        })

        if (!isSorted) {
          const sortedImportNodeGroup = importNodeGroup.map(g => g.sort((a, b) => {
            return a.source.value > b.source.value
          }))

          context.report({
            node,
            message: `import statements should be sorted`,
            fix(fixer) {
              return fixer.replaceTextRange(
                [importNodes[0].range[0], importNodes[importNodes.length - 1].range[1]],
                sortedImportNodeGroup
                .map(g => g.map(n => sourceCode.getText(n)).join('\n'))
                .join('\n\n')
              )
            }
          })
        }
      },
    }
  },
}
