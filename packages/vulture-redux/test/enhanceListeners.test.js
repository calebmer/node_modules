import assert from 'assert'
import { jsdom } from 'jsdom'
import { v } from 'vulture'
import { renderToDOM } from 'vulture/dom'
import { createStore } from 'redux'
import enhanceListeners from '../lib/enhanceListeners'

describe('enhanceListeners()', () => {
  it('will dispatch event outputs', () => {
    const dispatchedTypes = []
    const reducer = (state, { type }) => (dispatchedTypes.push(type), state)
    const store = createStore(reducer)

    const node = (
      v('#a', {
        otherPropertyA: true,
        onClick: () => ({ type: 'a' })
      }, [
        v('#b', {
          otherPropertyB: false,
          onEvent1: () => ({ type: 'b1' }),
          onEvent2: () => ({ type: 'b2' })
        })
      ])
    )

    const { defaultView: window } = jsdom('<div id="container"></div>')
    const { document, Event } = window
    const containerNode = document.getElementById('container')

    renderToDOM(enhanceListeners(store)(node), containerNode, document)

    const divA = document.getElementById('a')
    const divB = document.getElementById('b')

    divA.dispatchEvent(new Event('click'))
    divA.dispatchEvent(new Event('scroll'))
    divB.dispatchEvent(new Event('click'))
    divB.dispatchEvent(new Event('event1'))
    divB.dispatchEvent(new Event('event2'))
    divB.dispatchEvent(new Event('event2'))
    divA.dispatchEvent(new Event('click'))
    divB.dispatchEvent(new Event('event2'))
    divB.dispatchEvent(new Event('event1'))
    divB.dispatchEvent(new Event('event2'))
    divA.dispatchEvent(new Event('click'))

    assert.deepEqual(dispatchedTypes, ['@@redux/INIT', 'a', 'b1', 'b2', 'b2', 'a', 'b2', 'b1', 'b2', 'a'])
  })
})
