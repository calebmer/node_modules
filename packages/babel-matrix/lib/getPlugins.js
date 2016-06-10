'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPluginSources = require('./getPluginSources.js');

var _getPluginSources2 = _interopRequireDefault(_getPluginSources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the `require`d form of all of the babel plugins for a given input and
 * output list of syntaxes. This function does require that the plugins have
 * been installed so they may be `require`d.
 *
 * @param  {[string]} inputSyntaxes  A list of input syntaxes to use.
 * @param  {[string]} outputSyntaxes A list of output syntaxes to use.
 * @param  {boolean}  isProduction   A boolean specifying whether or not to include production plugins. Default is false.
 * @return {[object]}                A list of the `require`d Babel plugins.
 */
function getPlugins(inputSyntaxes, outputSyntaxes) {
  var isProduction = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var pluginSources = (0, _getPluginSources2.default)(inputSyntaxes, outputSyntaxes, isProduction);
  return pluginSources.map(function (pluginSource) {
    return require(pluginSource.name);
  });
}

exports.default = getPlugins;