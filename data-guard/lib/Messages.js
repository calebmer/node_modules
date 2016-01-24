const isString = require('lodash/isString')
const isArray = require('lodash/isArray')

const Messages = {
  creators: {
    boolean: value => `${getValue(value)} is the wrong type. Must be boolean, not ${getType(value)}`,
    number: value => `${getValue(value)} is the wrong type. Must be number, not ${getType(value)}`,
    string: value => `${getValue(value)} is the wrong type. Must be string, not ${getType(value)}`,
    object: value => `${getValue(value)} is the wrong type. Must be object, not ${getType(value)}`,
    array: value => `${getValue(value)} is the wrong type. Must be array, not ${getType(value)}`,
    function: value => `${getValue(value)} is the wrong type. Must be function, not ${getType(value)}`,
    required: () => `A value is required`,
    shape: () => `The value has an incorrect shape`,
    items: () => `Some of the item are invalid`,
    match: value => `${getValue(value)} failed its regular expression test`,
    enum: value => `${getValue(value)} is not one of the defined values`,
    instanceOf: value => `${getValue(value)} is not an instance of the defined constructor`
  },

  create (name, path, value) {
    const messageCreator = this.creators[name]
    if (messageCreator) {
      return `${messageCreator(value)} @ ${path}`
    } else {
      return `${value} failed ${name} validation @ ${path}`
    }
  }
}

module.exports = Messages

function getValue (value) {
  return isString(value) ? `"${value}"` : value.toString()
}

function getType (value) {
  return isArray(value) ? 'array' : typeof value
}
