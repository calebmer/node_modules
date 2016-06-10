import { uniq, lowerCase } from 'lodash'
import getCellPluginSources from './getCellPluginSources.js'

/**
 * Gets the `PluginSource` form a last of input and a list of output syntaxes.
 *
 * @param  {[string]}       inputSyntaxes  A list of input syntaxes to use.
 * @param  {[string]}       outputSyntaxes A list of output syntaxes to use.
 * @param  {boolean}        isProduction   A boolean specifying whether or not to include production plugins. Default is false.
 * @return {[PluginSource]}                A list of `PluginSource`s to be used by Babel when transpiling.
 */
function getPluginSources (inputSyntaxes, outputSyntaxes, isProduction = false) {
  const pluginSources = []
  const addPluginSources = ps => ps.forEach(p => pluginSources.push(p))

  // Make sure we only have unique lower case syntaxes in our lists.
  inputSyntaxes = uniq(inputSyntaxes.map(lowerCase))
  outputSyntaxes = uniq(outputSyntaxes.map(lowerCase))

  // Get all of the combinations for the input and output syntaxes and add the
  // plugins they use.
  inputSyntaxes.forEach(inputSyntax => {
    outputSyntaxes.forEach(outputSyntax => {
      const cellPluginSources = getCellPluginSources(inputSyntax, outputSyntax, isProduction)
      addPluginSources(cellPluginSources)
    })
  })

  return pluginSources
}

export default getPluginSources
