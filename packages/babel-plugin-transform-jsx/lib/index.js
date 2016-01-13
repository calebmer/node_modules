import identity from 'lodash/utility/identity'
import ary from 'lodash/function/ary'
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

  const JSXElementName = transformOnType({ JSXIdentifier, JSXNamespacedName, JSXMemberExpression })

  const JSXExpressionContainer = node => node.expression

  const JSXAttributeName = JSXElementName

  const JSXAttributeValue = transformOnType({
    StringLiteral: node => node,
    JSXExpressionContainer
  })

  const JSXAttributes = state => nodes => {
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

  const JSXChild = state => transformOnType({ JSXText, JSXElement: JSXElement(state), JSXExpressionContainer })

  const JSXChildren = state => nodes => t.arrayExpression(nodes.map(JSXChild(state)))

  const JSXElement = state => node => state.get('jsxObjectMapper')(
    t.objectExpression([
      t.objectProperty(t.identifier(nameProperty), JSXElementName(node.openingElement.name)),
      t.objectProperty(t.identifier(attributesProperty), JSXAttributes(state)(node.openingElement.attributes)),
      t.objectProperty(t.identifier(childrenProperty), node.closingElement ? JSXChildren(state)(node.children) : t.nullLiteral())
    ])
  )

  /* ==========================================================================
   * Misc Functions
   * ======================================================================= */

  const initJSX = (path, state) => {
    const {
      opts: {
        useNew = false,
        module: constructorModule,
        function: constructorFunction
      }
    } = state

    const executeExpression = useNew ? t.newExpression : t.callExpression
    const valueWrapper = expression => value => executeExpression(expression, [value])

    if (constructorModule) {
      const moduleName = path.scope.generateUidIdentifier(constructorFunction || useNew ? 'JSXNode' : 'jsx')
      state.set('jsxObjectMapper', valueWrapper(moduleName))

      const importDeclaration = t.importDeclaration(
        [t.importDefaultSpecifier(moduleName)],
        t.stringLiteral(constructorModule)
      )

      path.findParent(p => p.isProgram()).unshiftContainer('body', importDeclaration)
    }

    else if (constructorFunction) {
      const expression = constructorFunction.split('.').map(ary(t.identifier, 1)).reduce(ary(t.memberExpression, 2))
      state.set('jsxObjectMapper', valueWrapper(expression))
    }

    else {
      state.set('jsxObjectMapper', identity)
    }
  }

  /* ==========================================================================
   * Plugin
   * ======================================================================= */

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      JSXElement(path, state) {
        if (!state.get('jsxInit')) {
          initJSX(path, state)
          state.set('jsxInit', true)
        }

        // Replace JSX with an object.
        path.replaceWith(JSXElement(state)(path.node))
      }
    }
  }
}
