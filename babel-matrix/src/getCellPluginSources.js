import { compact } from 'lodash'
import * as s from './syntaxes.js'
import PluginSource from './PluginSource.js'

/**
 * Gets plugins for a given cell in the syntax matrix.
 *
 * @param  {string}         inputSyntax  The input syntax, should be one of the syntax strings.
 * @param  {string}         outputSyntax The output syntax, should be one of the output syntax strings.
 * @param  {boolean}        isProduction A flag signaling whether or not production plugins should be added.
 * @return {[PluginSource]}              A list of the `PluginSource`s to be used by Babel for this cell of the matrix.
 */
function getCellPluginSources (inputSyntax, outputSyntax, isProduction = false) {
  // This function is a really good argument against JavaScript…
  // Consider using coffeescript.
  switch (inputSyntax) {
    case s.COMMON_JS:
    case s.AMD:
    case s.UMD:
    case s.SYSTEM_JS: {
      switch (outputSyntax) {
        case s.COMMON_JS:
        case s.AMD:
        case s.UMD:
        case s.SYSTEM_JS:
        case s.ES_MODULES:
          throw new Error(`Module syntax '${inputSyntax}' can not build to '${outputSyntax}'.`)
        default:
          return []
      }
    }
    case s.ES_MODULES: {
      switch (outputSyntax) {
        case s.COMMON_JS:
          return [STRICT_PLUGIN, p('transform-es2015-modules-commonjs', '6.6.x')]
        case s.AMD:
          return [STRICT_PLUGIN, p('transform-es2015-modules-amd', '6.6.x')]
        case s.UMD:
          return [STRICT_PLUGIN, p('transform-es2015-modules-umd', '6.6.x')]
        case s.SYSTEM_JS:
          return [STRICT_PLUGIN, p('transform-es2015-modules-systemjs', '6.6.x')]
        default:
          return [STRICT_PLUGIN]
      }
    }
    case s.ES5: {
      switch (outputSyntax) {
        case s.ES6:
        case s.ESNEXT:
          throw new Error(`Cannot build es5 to new syntax '${outputSyntax}'.`)
        default:
          return []
      }
    }
    case s.ES6: {
      switch (outputSyntax) {
        case s.ES5:
          return ES6_TO_ES5_PLUGINS
        case s.ESNEXT:
          throw new Error('Cannot build es6 to new syntax esnext')
        default:
          return []
      }
    }
    case s.ESNEXT: {
      switch (outputSyntax) {
        case s.ES5:
          return ESNEXT_TO_ES5_PLUGINS
        case s.ES6:
          return ESNEXT_TO_ES6_PLUGINS
        default:
          return []
      }
    }
    case s.REACT: {
      switch (outputSyntax) {
        case s.REACT:
          return []
        default:
          return compact([
            p('syntax-jsx', '6.5.x'),
            p('transform-react-jsx', '6.5.x'),
            p('transform-react-display-name', '6.5.x'),
            isProduction ? p('transform-react-constant-elements', '6.5.x') : null,
            isProduction ? p('transform-react-inline-elements', '6.6.x') : null
          ])
      }
    }
    case s.FLOW: {
      switch (outputSyntax) {
        case s.FLOW:
          return []
        default:
          return [
            p('syntax-flow', '6.5.x'),
            isProduction
            ? p('transform-strip-flow-types', '6.7.x')
            : p('transform-flow-comments', '6.7.x')
          ]
      }
    }
    default:
      return []
  }
}

export default getCellPluginSources

// Convenience function for creating the source of babel plugins.
function p (generalName, version) {
  return new PluginSource(`babel-plugin-${generalName}`, `babel-plugin-${generalName}@${version}`)
}

const STRICT_PLUGIN = p('transform-strict-mode', '6.6.x')

const ES6_TO_ES5_PLUGINS = [
  p('transform-es2015-template-literals', '6.6.x'),
  p('transform-es2015-literals', '6.3.x'),
  p('transform-es2015-function-name', '6.3.x'),
  p('transform-es2015-arrow-functions', '6.3.x'),
  p('transform-es2015-block-scoped-functions', '6.3.x'),
  p('transform-es2015-classes', '6.6.x'),
  p('transform-es2015-object-super', '6.3.x'),
  p('transform-es2015-shorthand-properties', '6.3.x'),
  p('transform-es2015-computed-properties', '6.3.x'),
  p('transform-es2015-duplicate-keys', '6.6.x'),
  p('transform-es2015-for-of', '6.6.x'),
  p('transform-es2015-sticky-regex', '6.3.x'),
  p('transform-es2015-unicode-regex', '6.3.x'),
  p('check-es2015-constants', '6.3.x'),
  p('transform-es2015-spread', '6.3.x'),
  p('transform-es2015-parameters', '6.6.x'),
  p('transform-es2015-destructuring', '6.6.x'),
  p('transform-es2015-block-scoping', '6.6.x'),
  p('transform-es2015-typeof-symbol', '6.6.x'),
  p('transform-regenerator', '6.6.x')
]

const ESNEXT_TO_ES6_PLUGINS = [
  p('transform-async-to-generator', '6.7.x'),
  p('transform-exponentiation-operator', '6.5.x'),
  p('syntax-trailing-function-commas', '6.5.x'),
  p('transform-object-rest-spread', '6.6.x'),
  p('transform-class-constructor-call', '6.6.x'),
  p('transform-class-properties', '6.6.x'),
  p('transform-decorators', '6.6.x'),
  p('transform-export-extensions', '6.5.x'),
  p('transform-do-expressions', '6.5.x'),
  p('transform-function-bind', '6.5.x')
]

const ESNEXT_TO_ES5_PLUGINS = ESNEXT_TO_ES6_PLUGINS.concat(ES6_TO_ES5_PLUGINS)
