'use strict';

var mapValues = require('lodash/mapValues');
var Validators = require('./Validators');
var createSuperValidator = require('./createSuperValidator');

var DataGuard = mapValues(Validators, function (validator, name) {
  return function () {
    var _createSuperValidator;

    return (_createSuperValidator = createSuperValidator())[name].apply(_createSuperValidator, arguments);
  };
});

module.exports = DataGuard;