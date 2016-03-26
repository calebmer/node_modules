/**
 * Representation of a Babel plugin hosted on NPM.
 *
 * @class
 */
class PluginSource {
  constructor (name, installation) {
    this.name = name
    this.installation = installation
  }
}

export default PluginSource
