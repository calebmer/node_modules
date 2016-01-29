import isString from 'lodash/isString'
import identity from 'lodash/identity'
import ary from 'lodash/ary'
import esutils from 'esutils'

const nameProperty = 'elementName'
const attributesProperty = 'attributes'
const childrenProperty = 'children'

export default function ({ types: t }) {
  /* ==========================================================================
   * Utilities
   * ======================================================================= */

  const transformOnType = transforms => node => {
    const transformer = transforms[node.type]
    if (transformer) {
      return transformer(node)
    }
    throw new Error(`${node.type} could not be transformed`)
  }

  /* ==========================================================================
   * Initial configuration
   * ======================================================================= */

  const initConfig = (path, state) => {
    const {
      useNew = false,
      module: constructorModule,
      function: constructorFunction,
      useVariables = false
    } = state.opts

    let variablesRegex, jsxObjectTransformer

    if (useVariables === true) {
      // Use the default variables regular expression when true.
      variablesRegex = /^[A-Z]/
    } else if (isString(useVariables)) {
      // If it’s a plain regular expression string.
      variablesRegex = new RegExp(useVariables)
    }

    const executeExpression = useNew ? t.newExpression : t.callExpression
    const jsxObjectTransformerCreator = expression => value => executeExpression(expression, [value])

    if (constructorModule) {
      // If the constructor function will be retrieved from a module.
      const moduleName = path.scope.generateUidIdentifier(useNew ? 'JSXNode' : 'jsx')
      jsxObjectTransformer = jsxObjectTransformerCreator(moduleName)

      const importDeclaration = t.importDeclaration(
        [t.importDefaultSpecifier(moduleName)],
        t.stringLiteral(constructorModule)
      )

      // Add the import declration to the top of the file.
      path.findParent(p => p.isProgram()).unshiftContainer('body', importDeclaration)
    } else if (constructorFunction) {
      // If the constructor function will be an in scope function.
      const expression = constructorFunction.split('.').map(ary(t.identifier, 1)).reduce(ary(t.memberExpression, 2))
      jsxObjectTransformer = jsxObjectTransformerCreator(expression)
    } else {
      // Otherwise, we won‘t be mapping.
      jsxObjectTransformer = identity
    }

    return {
      variablesRegex,
      jsxObjectTransformer
    }
  }

  /* =========================================================================
   * Visitors
   * ======================================================================= */

  const visitJSXElement = (path, state) => {
    if (!state.get('jsxConfig')) {
      state.set('jsxConfig', initConfig(path, state))
    }

    const {
      variablesRegex,
      jsxObjectTransformer
    } = state.get('jsxConfig')

    /* ==========================================================================
     * Node Transformers
     * ======================================================================= */

    const JSXIdentifier = node => t.stringLiteral(node.name)

    const JSXNamespacedName = node => t.stringLiteral(`${node.namespace.name}:${node.name.name}`)

    const JSXMemberExpression = transformOnType({
      JSXIdentifier: node => t.identifier(node.name),
      JSXMemberExpression: node => (
        t.memberExpression(
          JSXMemberExpression(node.object),
          JSXMemberExpression(node.property)
        )
      )
    })

    const JSXElementName = transformOnType({
      JSXIdentifier: variablesRegex
        ? node => variablesRegex.test(node.name) ? t.identifier(node.name) : JSXIdentifier(node)
        : JSXIdentifier,
      JSXNamespacedName,
      JSXMemberExpression
    })

    const JSXExpressionContainer = node => node.expression

    const JSXAttributeName = transformOnType({ JSXIdentifier, JSXNamespacedName, JSXMemberExpression })

    const JSXAttributeValue = transformOnType({
      StringLiteral: node => node,
      JSXExpressionContainer
    })

    const JSXAttributes = nodes => {
      let object = []
      const objects = []

      nodes.forEach(node => {
        switch (node.type) {
          case 'JSXAttribute': {
            if (!object) {
              object = []
            }

            const attributeName = JSXAttributeName(node.name)

            const objectKey = esutils.keyword.isIdentifierNameES6(attributeName.value) ?
              t.identifier(attributeName.value) :
              attributeName

            object.push(t.objectProperty(objectKey, JSXAttributeValue(node.value)))
            break
          }
          case 'JSXSpreadAttribute': {
            if (object) {
              objects.push(t.objectExpression(object))
              object = null
            }

            objects.push(node.argument)
            break
          }
          default:
            throw new Error(`${node.type} cannot be used as a JSX attribute`)
        }
      })

      if (object && object.length > 0) {
        objects.push(t.objectExpression(object))
      }

      if (objects.length === 0) {
        return t.objectExpression([])
      }
      else if (objects.length === 1) {
        return objects[0]
      }

      return (
        t.callExpression(
          state.addHelper('extends'),
          objects
        )
      )
    }

    const JSXText = node => t.stringLiteral(node.value.replace(/\s+/g, ' '))

    const JSXElement = node => {

      const JSXChild = transformOnType({ JSXText, JSXElement, JSXExpressionContainer })

      const JSXChildren = nodes => t.arrayExpression(nodes.map(JSXChild))

      return jsxObjectTransformer(
        t.objectExpression([
          t.objectProperty(t.identifier(nameProperty), JSXElementName(node.openingElement.name)),
          t.objectProperty(t.identifier(attributesProperty), JSXAttributes(node.openingElement.attributes)),
          t.objectProperty(t.identifier(childrenProperty), node.closingElement ? JSXChildren(node.children) : t.nullLiteral())
        ])
      )
    }

    // Actually replace JSX with an object.
    path.replaceWith(JSXElement(path.node))
  }

  /* ==========================================================================
   * Plugin
   * ======================================================================= */

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      JSXElement: visitJSXElement
    }
  }
}
