const Messages = require('./Messages')
const validate = require('./validate')

const unknownValidationMessage = 'Validation failed for unknown reasons'

const createGuard = ({ strict = false } = {}) => (...validators) => func => function guardedFunction (...args) {
  const funcName = func.name

  for (const index in validators) {
    const { success, details } = validate(validators[index], args[index])
    if (!success) {
      let warned = false
      details.forEach(({ path, value, errors }) =>
        errors.forEach(name => {
          warned = true
          const errorMessage = Messages.create(name, `/${index}${path === '/' ? '' : path}`, value)
          if (strict) {
            throw new Error(errorMessage)
          } else {
            console.warn(`Validation error for ${funcName || 'an anonymous function'}. ${errorMessage}`)
          }
        })
      )
      if (!warned) {
        if (strict) {
          throw new Error(unknownValidationMessage)
        } else {
          console.warn(unknownValidationMessage)
        }
      }
    }
  }

  return func.apply(this, args)
}

const guard = createGuard()
guard.strict = createGuard({ strict: true })

module.exports = guard
