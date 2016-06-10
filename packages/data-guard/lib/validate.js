'use strict';

var Messages = require('./Messages');
var normalizeValidator = require('./normalizeValidator');
var ValidationContext = require('./ValidationContext');

var createValidate = function createValidate() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$strict = _ref.strict;
  var strict = _ref$strict === undefined ? false : _ref$strict;
  return function (validator, maybeValue) {
    var actuallyValidate = function actuallyValidate(value) {
      validator = normalizeValidator(validator);
      var result = ValidationContext.runValidation(function () {
        return validator(value);
      });

      if (strict) {
        result.details.forEach(function (_ref2) {
          var path = _ref2.path;
          var value = _ref2.value;
          var errors = _ref2.errors;
          return errors.forEach(function (name) {
            throw new Error(Messages.create(name, path, value));
          });
        });
        if (!result.success) {
          throw new Error('Validation failed for unknown reasons.');
        }
        return true;
      }

      return result;
    };

    if (maybeValue) {
      return actuallyValidate(maybeValue);
    }

    return actuallyValidate;
  };
};

var validate = createValidate();
validate.strict = createValidate({ strict: true });

module.exports = validate;