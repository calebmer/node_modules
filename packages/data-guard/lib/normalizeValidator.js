const isFunction = require('lodash/isFunction')
const createObjectValidator = require('./createObjectValidator')

function normalizeValidator(validator) {
  return isFunction(validator) ? validator : createObjectValidator(validator)
}

module.exports = normalizeValidator
