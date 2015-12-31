import mapValues from 'lodash/object/mapValues'
import wrap from 'lodash/function/wrap'
import Vulture, { EventHook } from 'vulture'

/**
 * Searches through a virtual DOM for event hooks and wraps the event listener
 * so that the return value of the listener (if not falsey) is dispatched by
 * redux.
 *
 * @param {Store} A redux store.
 * @return {function} The virtual DOM transformation function.
 */

export default function enhanceListeners(store) {
  return rootNode => (
    Vulture.map(rootNode, node => {
      node.properties = mapValues(node.properties, enhanceProperty)
      return node
    })
  )

  /**
   * Takes a property and if it is an `EventHook` then we wrap the event listener
   * so that it may dispatch the return value.
   *
   * @private
   * @see dispatchListenerOutput
   * @param {any} The property value.
   * @return {any} The property value which might have a new listener function.
   */

  function enhanceProperty(property, key) {
    if (property instanceof EventHook) {
      property.listener = wrap(property.listener, eventListenerWrapper)
    }
    return property
  }

  /**
   * Fires an event listener and captures the action which is then dispatched.
   *
   * @private
   * @see enhanceProperty
   * @param {function} The original listener function.
   * @param {Event} The event to call the listener function with.
   */

  function eventListenerWrapper(listener, event) {
    const action = listener(event)
    if (action) {
      store.dispatch(action)
    }
  }
}
