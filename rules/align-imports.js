'use strict'

function isAligned(nodeText, paddingLength) {
  const textBlob = nodeText.split('from')[0]
  const lines = textBlob.split('\n')
  const lastLine = lines[lines.length - 1]
  return lastLine.length === paddingLength
}

function alignNode(nodeText, paddingLength) {
  const lines = nodeText.split('\n')
  const tokens = lines[lines.length - 1].split('from')
  const requiredSpaces = paddingLength - tokens[0].trim().length
  tokens[0] = tokens[0].trim() + ' '.repeat(requiredSpaces)
  const alignedLastLine = tokens.join('from')

  return [...lines.slice(0, lines.length - 1), alignedLastLine].join('\n')
}

module.exports = {
  meta: {
    fixable: 'whitespace',
  },
  create: context => {
    const sourceCode = context.getSourceCode()

    let paddingLength = 0

    return {
      Program: node => {
        const importNodes = node.body.filter(n => n.type === 'ImportDeclaration')
        paddingLength = Math.max(
          ...importNodes
            .map(
              n => sourceCode.getText(n).split('from')[0]
            )
            .map(
              textBlob => Math.max(
                ...textBlob.split('\n')
                  .map(s => s.trim().length + 1)
              )
            )
        )
      },
      ImportDeclaration: node => {
        const aligned = isAligned(sourceCode.getText(node), paddingLength)

        if (!aligned) {
          context.report({
            node,
            message: 'import statements should be aligned',
            fix: (fixer) => fixer.replaceTextRange(
              node.range,
              alignNode(sourceCode.getText(node), paddingLength)
            )
          })
        }
      },
    }
  },
}
