'use strict';

var _lodash = require('lodash');

exports.getPlugins = require('./getPlugins.js').default;
exports.getPluginSources = require('./getPluginSources.js').default;
exports.PluginSource = require('./PluginSource.js').default;

(0, _lodash.assign)(exports, require('./syntaxes.js'));