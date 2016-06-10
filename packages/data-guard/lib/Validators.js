'use strict';

var isBoolean = require('lodash/isBoolean');
var isNumber = require('lodash/isNumber');
var isString = require('lodash/isString');
var isObject = require('lodash/isObjectLike');
var isArray = require('lodash/isArrayLikeObject');
var isFunction = require('lodash/isFunction');
var mapValues = require('lodash/mapValues');
var flow = require('lodash/flow');
var normalizeValidator = require('./normalizeValidator');
var createObjectValidator = require('./createObjectValidator');
var createArrayValidator = require('./createArrayValidator');
var ValidationContext = require('./ValidationContext');

var maybe = function maybe(validator) {
  return function (value) {
    return value == null || validator(value);
  };
};

var Validators = mapValues({
  any: function any() {
    return function () {
      return true;
    };
  },
  boolean: function boolean() {
    return maybe(isBoolean);
  },
  number: function number() {
    return maybe(isNumber);
  },
  string: function string() {
    return maybe(isString);
  },
  object: function object() {
    return maybe(function (value) {
      return isObject(value) && !isArray(value);
    });
  },
  array: function array() {
    return maybe(isArray);
  },
  function: function _function() {
    return maybe(isFunction);
  },
  required: function required() {
    return function (value) {
      return value != null;
    };
  },
  shape: createObjectValidator,
  items: flow(normalizeValidator, createArrayValidator),
  match: function match(regex) {
    return function (value) {
      return regex.test(value);
    };
  },
  enum: function _enum(values) {
    return function (value) {
      return values.indexOf(value) !== -1;
    };
  },
  instanceOf: function instanceOf(func) {
    return function (value) {
      return value instanceof func;
    };
  }
}, transformToReportError);

module.exports = Validators;

function transformToReportError(createValidator, name) {
  return function () {
    var validator = createValidator.apply(undefined, arguments);
    return function (value) {
      var success = validator(value);

      ValidationContext.setValue(value);

      if (!success) {
        ValidationContext.addError(name);
      }

      return success;
    };
  };
}