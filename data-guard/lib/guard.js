const Messages = require('./Messages')
const validate = require('./validate')

const createGuard = ({ strict = false } = {}) => (...validators) => func => function guardedFunction(...args) {
  const funcName = func.name

  for (const index in validators) {
    const { success, details } = validate(validators[index], args[index])
    if (!success) {
      details.forEach(({ path, value, errors }) =>
        errors.forEach(name => {
          const errorMessage = Messages.create(name, `/${index}${path === '/' ? '' : path}`, value)
          if (strict) {
            throw new Error(errorMessage)
          } else {
            console.warn(`Validation error for ${funcName || 'an anonymous function'}. ${errorMessage}`)
          }
        })
      )
    }
  }

  return func.apply(this, args)
}

const guard = createGuard()
guard.strict = createGuard({ strict: true })

module.exports = guard
