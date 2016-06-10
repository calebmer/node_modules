'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _getCellPluginSources = require('./getCellPluginSources.js');

var _getCellPluginSources2 = _interopRequireDefault(_getCellPluginSources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the `PluginSource` form a last of input and a list of output syntaxes.
 *
 * @param  {[string]}       inputSyntaxes  A list of input syntaxes to use.
 * @param  {[string]}       outputSyntaxes A list of output syntaxes to use.
 * @param  {boolean}        isProduction   A boolean specifying whether or not to include production plugins. Default is false.
 * @return {[PluginSource]}                A list of `PluginSource`s to be used by Babel when transpiling.
 */
function getPluginSources(inputSyntaxes, outputSyntaxes) {
  var isProduction = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var pluginSources = [];
  var addPluginSources = function addPluginSources(ps) {
    return ps.forEach(function (p) {
      return pluginSources.push(p);
    });
  };

  // Make sure we only have unique lower case syntaxes in our lists.
  inputSyntaxes = (0, _lodash.uniq)(inputSyntaxes.map(_lodash.lowerCase));
  outputSyntaxes = (0, _lodash.uniq)(outputSyntaxes.map(_lodash.lowerCase));

  // Get all of the combinations for the input and output syntaxes and add the
  // plugins they use.
  inputSyntaxes.forEach(function (inputSyntax) {
    outputSyntaxes.forEach(function (outputSyntax) {
      var cellPluginSources = (0, _getCellPluginSources2.default)(inputSyntax, outputSyntax, isProduction);
      addPluginSources(cellPluginSources);
    });
  });

  return pluginSources;
}

exports.default = getPluginSources;