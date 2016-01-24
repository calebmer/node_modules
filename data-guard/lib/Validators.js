const isBoolean = require('lodash/isBoolean')
const isNumber = require('lodash/isNumber')
const isString = require('lodash/isString')
const isObject = require('lodash/isObjectLike')
const isArray = require('lodash/isArrayLikeObject')
const isFunction = require('lodash/isFunction')
const mapValues = require('lodash/mapValues')
const flow = require('lodash/flow')
const normalizeValidator = require('./normalizeValidator')
const createObjectValidator = require('./createObjectValidator')
const createArrayValidator = require('./createArrayValidator')
const ValidationContext = require('./ValidationContext')

const maybe = validator => value => value == null || validator(value)

const Validators = mapValues({
  any: () => () => true,
  boolean: () => maybe(isBoolean),
  number: () => maybe(isNumber),
  string: () => maybe(isString),
  object: () => maybe(value => isObject(value) && !isArray(value)),
  array: () => maybe(isArray),
  function: () => maybe(isFunction),
  required: () => value => value != null,
  shape: createObjectValidator,
  items: flow(normalizeValidator, createArrayValidator),
  match: regex => value => regex.test(value),
  enum: values => value => values.indexOf(value) !== -1,
  instanceOf: func => value => value instanceof func
}, transformToReportError)

module.exports = Validators

function transformToReportError (createValidator, name) {
  return (...args) => {
    const validator = createValidator(...args)
    return value => {
      const success = validator(value)

      ValidationContext.setValue(value)

      if (!success) {
        ValidationContext.addError(name)
      }

      return success
    }
  }
}
