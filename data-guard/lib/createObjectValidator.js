const ValidationContext = require('./ValidationContext')

function createObjectValidator (shape) {
  return object => {
    if (!object) {
      return false
    }

    const validatedKeys = Object.keys(shape).map(key => ValidationContext.run(key, () => {
      const validator = shape[key]
      const value = object[key]
      return validator(value)
    }))

    for (const index in validatedKeys) {
      if (!validatedKeys[index]) {
        return false
      }
    }

    return true
  }
}

module.exports = createObjectValidator
