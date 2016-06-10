import { assign } from 'lodash'

exports.getPlugins = require('./getPlugins.js').default
exports.getPluginSources = require('./getPluginSources.js').default
exports.PluginSource = require('./PluginSource.js').default

assign(exports, require('./syntaxes.js'))
