'use strict'

const R = require('ramda')
const path = require('path')
const fs = require('fs')

module.exports = function findNodeModules(cwd = process.cwd()) {
  const found = R.find(R.equals('node_modules'), fs.readdirSync(cwd))
  return found ? path.resolve(cwd, found) : findNodeModules(path.resolve('..'))
}
