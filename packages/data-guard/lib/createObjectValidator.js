'use strict';

var ValidationContext = require('./ValidationContext');

function createObjectValidator(shape) {
  return function (object) {
    if (!object) {
      return false;
    }

    var validatedKeys = Object.keys(shape).map(function (key) {
      return ValidationContext.run(key, function () {
        var validator = shape[key];
        var value = object[key];
        return validator(value);
      });
    });

    for (var index in validatedKeys) {
      if (!validatedKeys[index]) {
        return false;
      }
    }

    return true;
  };
}

module.exports = createObjectValidator;