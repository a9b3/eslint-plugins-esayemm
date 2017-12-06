'use strict'

function getNodeGroupRange(nodeGroup) {
  return [
    Math.min(...nodeGroup.map(n => n.range[0])),
    Math.max(...nodeGroup.map(n => n.range[1])),
  ]
}

module.exports = {
  meta: {
    fixable: 'code',
  },
  create: context => {
    const sourceCode = context.getSourceCode()

    return {
      'Program:exit': node => {
        const importNodes = node.body.filter(n => n.type === 'ImportDeclaration')
        const importNodeGroup = importNodes.reduce((arr, n, i) => {
          const prevNode = importNodes[i - 1]
          if (!prevNode || n.start - prevNode.end > 1) {
            arr.push([])
          }
          arr[arr.length - 1].push(n)
          return arr
        }, [])

        // check if its already sorted
        const isSorted = importNodeGroup.every(g => {
          for (let i = 0; i < g.length-1; i++) {
            if (g[i+1].source.value < g[i].source.value) {
              return false
            }
          }
          return true
        })

        if (!isSorted) {
          const sortedImportNodeGroup = importNodeGroup.map(
            g => g.sort((a, b) => {
              if (a.source.value > b.source.value) {
                return 1
              } else if (a.source.value < b.source.value) {
                return -1
              } else {
                return 0
              }
            })
          )

          context.report({
            node,
            message: `import statements should be sorted`,
            fix(fixer) {
              return sortedImportNodeGroup.map(nodeGroup => fixer.replaceTextRange(
                getNodeGroupRange(nodeGroup),
                nodeGroup.map(n => sourceCode.getText(n)).join('\n'),
              ))
            }
          })
        }
      },
    }
  },
}
