'use strict';

var assign = require('lodash/assign');
var mapValues = require('lodash/mapValues');
var Validators = require('./Validators');

function createSuperValidator() {
  var validators = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var superValidator = function superValidator(value) {
    return validators.reduce(function (success, validator) {
      return validator(value) && success;
    }, true);
  };

  assign(superValidator, mapValues(Validators, function (createValidator) {
    return function () {
      return createSuperValidator(validators.concat([createValidator.apply(undefined, arguments)]));
    };
  }));

  return superValidator;
}

module.exports = createSuperValidator;