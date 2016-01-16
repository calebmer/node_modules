const ValidationContext = {
  root: null,
  stack: [],
  details: [],

  head() {
    const { stack } = this
    return stack.length === 0 ? null : stack[stack.length - 1]
  },

  runValidation(validation) {
    const { stack, details } = this

    const detail = createDetail()

    details.push(detail)
    stack.push(detail)

    const success = validation()

    // Reset the stack and details.
    this.stack = []
    this.details = []

    // It‘s more asthetic to have this be `/` representing the root.
    detail.path = '/'

    return {
      success,
      details: details.filter(detail => detail.errors.length > 0)
    }
  },

  run(name, callback) {
    const { stack, details } = this

    // We can not run a named context as root.
    if (stack.length === 0) {
      return callback()
    }

    const detail = createDetail(`${this.head().path}/${name}`)

    details.push(detail)
    stack.push(detail)
    const result = callback()
    stack.pop()
    return result
  },

  setValue(value) {
    const head = this.head()
    if (head) {
      head.value = value
    }
  },

  addError(error) {
    const head = this.head()
    if (head) {
      head.errors.push(error)
    }
  }
}

module.exports = ValidationContext

function createDetail(path = '') {
  return {
    path,
    errors: []
  }
}
