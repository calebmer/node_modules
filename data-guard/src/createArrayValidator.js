const ValidationContext = require('./ValidationContext')

function createArrayValidator (validator) {
  return array => {
    if (!array) {
      return false
    }

    const validatedItems = array.map(
      (value, index) => ValidationContext.run(index, () => validator(value))
    )

    for (const index in validatedItems) {
      if (!validatedItems[index]) {
        return false
      }
    }

    return true
  }
}

module.exports = createArrayValidator
