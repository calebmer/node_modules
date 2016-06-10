var DataGuard = require('./DataGuard')

DataGuard.default = DataGuard
DataGuard.validate = require('./validate')
DataGuard.guard = require('./guard')

module.exports = DataGuard
