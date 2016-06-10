'use strict';

var Messages = require('./Messages');
var validate = require('./validate');

var unknownValidationMessage = 'Validation failed for unknown reasons';

var createGuard = function createGuard() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$strict = _ref.strict;
  var strict = _ref$strict === undefined ? false : _ref$strict;
  return function () {
    for (var _len = arguments.length, validators = Array(_len), _key = 0; _key < _len; _key++) {
      validators[_key] = arguments[_key];
    }

    return function (func) {
      return function guardedFunction() {
        var funcName = func.name;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _loop = function _loop(index) {
          var _validate = validate(validators[index], args[index]);

          var success = _validate.success;
          var details = _validate.details;

          if (!success) {
            var warned = false;
            details.forEach(function (_ref2) {
              var path = _ref2.path;
              var value = _ref2.value;
              var errors = _ref2.errors;
              return errors.forEach(function (name) {
                warned = true;
                var errorMessage = Messages.create(name, '/' + index + (path === '/' ? '' : path), value);
                if (strict) {
                  throw new Error(errorMessage);
                } else {
                  console.warn('Validation error for ' + (funcName || 'an anonymous function') + '. ' + errorMessage);
                }
              });
            });
            if (!warned) {
              if (strict) {
                throw new Error(unknownValidationMessage);
              } else {
                console.warn(unknownValidationMessage);
              }
            }
          }
        };

        for (var index in validators) {
          _loop(index);
        }

        return func.apply(this, args);
      };
    };
  };
};

var guard = createGuard();
guard.strict = createGuard({ strict: true });

module.exports = guard;