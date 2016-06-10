'use strict';

var ValidationContext = {
  root: null,
  stack: [],
  details: [],

  head: function head() {
    var stack = this.stack;

    return stack.length === 0 ? null : stack[stack.length - 1];
  },
  runValidation: function runValidation(validation) {
    var stack = this.stack;
    var details = this.details;

    var detail = createDetail();

    details.push(detail);
    stack.push(detail);

    var success = validation();

    // Reset the stack and details.
    this.stack = [];
    this.details = [];

    // It‘s more asthetic to have this be `/` representing the root.
    detail.path = '/';

    return {
      success: success,
      details: details.filter(function (detail) {
        return detail.errors.length > 0;
      })
    };
  },
  run: function run(name, callback) {
    var stack = this.stack;
    var details = this.details;

    // We can not run a named context as root.

    if (stack.length === 0) {
      return callback();
    }

    var detail = createDetail(this.head().path + '/' + name);

    details.push(detail);
    stack.push(detail);
    var result = callback();
    stack.pop();
    return result;
  },
  setValue: function setValue(value) {
    var head = this.head();
    if (head) {
      head.value = value;
    }
  },
  addError: function addError(error) {
    var head = this.head();
    if (head) {
      head.errors.push(error);
    }
  }
};

module.exports = ValidationContext;

function createDetail() {
  var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return {
    path: path,
    errors: []
  };
}