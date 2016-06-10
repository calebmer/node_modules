import getPluginSources from './getPluginSources.js'

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
function getPlugins (inputSyntaxes, outputSyntaxes, isProduction = false) {
  const pluginSources = getPluginSources(inputSyntaxes, outputSyntaxes, isProduction)
  return pluginSources.map(pluginSource => require(pluginSource.name))
}

export default getPlugins
