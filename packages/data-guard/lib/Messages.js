'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var isString = require('lodash/isString');
var isArray = require('lodash/isArray');

var Messages = {
  creators: {
    boolean: function boolean(value) {
      return getValue(value) + ' is the wrong type. Must be boolean, not ' + getType(value);
    },
    number: function number(value) {
      return getValue(value) + ' is the wrong type. Must be number, not ' + getType(value);
    },
    string: function string(value) {
      return getValue(value) + ' is the wrong type. Must be string, not ' + getType(value);
    },
    object: function object(value) {
      return getValue(value) + ' is the wrong type. Must be object, not ' + getType(value);
    },
    array: function array(value) {
      return getValue(value) + ' is the wrong type. Must be array, not ' + getType(value);
    },
    function: function _function(value) {
      return getValue(value) + ' is the wrong type. Must be function, not ' + getType(value);
    },
    required: function required() {
      return 'A value is required';
    },
    shape: function shape() {
      return 'The value has an incorrect shape';
    },
    items: function items() {
      return 'Some of the item are invalid';
    },
    match: function match(value) {
      return getValue(value) + ' failed its regular expression test';
    },
    enum: function _enum(value) {
      return getValue(value) + ' is not one of the defined values';
    },
    instanceOf: function instanceOf(value) {
      return getValue(value) + ' is not an instance of the defined constructor';
    }
  },

  create: function create(name, path, value) {
    var messageCreator = this.creators[name];
    if (messageCreator) {
      return messageCreator(value) + ' @ ' + path;
    } else {
      return value + ' failed ' + name + ' validation @ ' + path;
    }
  }
};

module.exports = Messages;

function getValue(value) {
  return isString(value) ? '"' + value + '"' : value.toString();
}

function getType(value) {
  return isArray(value) ? 'array' : typeof value === 'undefined' ? 'undefined' : _typeof(value);
}