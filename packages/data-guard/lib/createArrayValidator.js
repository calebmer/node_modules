'use strict';

var ValidationContext = require('./ValidationContext');

function createArrayValidator(validator) {
  return function (array) {
    if (!array) {
      return false;
    }

    var validatedItems = array.map(function (value, index) {
      return ValidationContext.run(index, function () {
        return validator(value);
      });
    });

    for (var index in validatedItems) {
      if (!validatedItems[index]) {
        return false;
      }
    }

    return true;
  };
}

module.exports = createArrayValidator;