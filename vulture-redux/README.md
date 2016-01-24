# vulture-redux
Functional programming bindings of [`redux`](http://npmjs.com/packages/redux) to [`vulture`](https://www.npmjs.com/package/vulture) inspired by [`react-redux`](https://www.npmjs.com/package/react-redux).

## API
### connect(mapStateToData?, mapDispatchToData?, mergeData?)(component)
Connects a vulture component to a redux store.

`vulture` allows the developer to pass in any number of arguments of any type. This means there is no standard “props” concept like in React. Because of this a few assumptions about the data structure must be made by `vulture-redux`.

The first argument of a `connect`ed function must be an object. This object *must* contain a redux store object. This first object will also be populated with data from the map functions defined by connect.

#### Arguments
- `mapStateToProps(state, ownData?)`: This optional user defined function takes the store’s current state and returns an object of data which will be passed to the decorated component.
- `mapDispatchToData(dispatch, ownData?)`: This optional user defined function takes the store’s dispatch function and maps it into an object which will be passed to the component. Returns an object where the only key/value pair is `dispatch` by default.
- `mergeData(stateData, dispatchData, ownData)`: This optional user defined function merges all of the different data objects together. The object returned by this functions is what actually gets passed to the decorated component.

#### Examples
This generally is hard to understand without some examples, so here we go.

This is without `vulture-redux`:

```js
import v from 'vulture'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

MyComponent({ store })

function MyComponent ({ store }) {
  const { message } = store.getState()
  return v('em', [message])
}
```

This is with `vulture-redux`:

```js
import v from 'vulture'
import { createStore } from 'redux'
import { connect } from 'vulture-redux'
import reducer from './reducer'

const store = createStore(reducer)

MyComponent({ store })

const MyComponent = connect(
  state => ({ message: state.message })
)(({ message }) => (
  v('em', [message])
))
```

And if you want to use `vulture`’s helper `createComponent` function:

```js
import v from 'vulture'
import { createComponent } from 'vulture/component'
import { createStore } from 'redux'
import { connect } from 'vulture-redux'
import reducer from './reducer'

const store = createStore(reducer)

export default createComponent(
  connect(
    state => ({ message: state.message })
  ),
  function MyComponent ({ message }) {
    return v('em', [message])
  }
)
```
