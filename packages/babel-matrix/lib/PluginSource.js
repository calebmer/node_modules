"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Representation of a Babel plugin hosted on NPM.
 *
 * @class
 */

var PluginSource = function PluginSource(name, version) {
  _classCallCheck(this, PluginSource);

  this.name = name;
  this.version = version;
};

exports.default = PluginSource;