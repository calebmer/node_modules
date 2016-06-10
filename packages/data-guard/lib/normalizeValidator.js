'use strict';

var isFunction = require('lodash/isFunction');
var createObjectValidator = require('./createObjectValidator');

function normalizeValidator(validator) {
  return isFunction(validator) ? validator : createObjectValidator(validator);
}

module.exports = normalizeValidator;