const Messages = require('./Messages')
const normalizeValidator = require('./normalizeValidator')
const ValidationContext = require('./ValidationContext')

const createValidate = ({ strict = false } = {}) => (validator, maybeValue) => {
  const actuallyValidate = value => {
    validator = normalizeValidator(validator)
    const result = ValidationContext.runValidation(() => validator(value))

    if (strict) {
      result.details.forEach(({ path, value, errors }) =>
        errors.forEach(name => {
          throw new Error(Messages.create(name, path, value))
        })
      )
      if (!result.success) {
        throw new Error('Validation failed for unknown reasons.')
      }
      return true
    }

    return result
  }

  if (maybeValue) {
    return actuallyValidate(maybeValue)
  }

  return actuallyValidate
}

const validate = createValidate()
validate.strict = createValidate({ strict: true })

module.exports = validate
