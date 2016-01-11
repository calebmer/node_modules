# babel-plugin-transform-jsx

What most people don‘t remember about JSX, which Facebook popularized with React, is that JSX is an [open standard][jsxs]. JSX is not exclusive to React and should be experimented with by other framework authors. This Babel plugin aims to provide the most general and un-opionated transformation of JSX as possible.

This plugin accomplishes this by eliminating the need for middleman functions and outputs plain JavaScript objects, which may then be mapped over to the appropriate format. For example, refer to the following JSX (from the [spec][jsxs]):

```jsx
var dropdown = (
  <Dropdown>
    A dropdown list
    <Menu>
      <MenuItem>Do Something</MenuItem>
      <MenuItem>Do Something Fun!</MenuItem>
      <MenuItem>Do Something Else</MenuItem>
    </Menu>
  </Dropdown>
);
```

This will roughly be transformed into the following JavaScript object:

```js
var dropdown = {
  elementName: 'Dropdown',
  attributes: {},
  children: [
    'A dropdown list',
    {
      elementName: 'Menu',
      attributes: {},
      children: [
        {
          elementName: 'MenuItem',
          attributes: {},
          children: ['Do Something']
        },
        {
          elementName: 'MenuItem',
          attributes: {},
          children: ['Do Something Fun!']
        },
        {
          elementName: 'MenuItem',
          attributes: {},
          children: ['Do Something Else']
        }
      ]
    }
  ]
};
```

No JSX pragma needed and no `/* @jsx */` comments needed.

## Examples
### Basic
#### JSX
```jsx
var jsx = (
  <article>
    <h1>Hello, kitten!</h1>
    <img href="http://placekitten.com/200/300" alt="A cute kitten"/>
    It is soooo cute.
  </article>
)
```

#### JavaScript
```js
var jsx = {
  elementName: 'article',
  attributes: {},
  children: [
    {
      elementName: 'h1',
      attributes: {},
      children: ['Hello, kitten!']
    },
    {
      elementName: 'img',
      attributes: {
        href: 'http://placekitten.com/200/300',
        alt: 'A cute kitten'
      },
      children: null
    },
    'It is soooo cute.'
  ]
}
```

### Spread
If you want a JSX element to get a lot of properties, a spread attribute is an easy and convenient way to accomplish this. Just use `...` with an object with all the key/value pairs you want to pass on as attributes.

#### JSX
```jsx
var foo = {
  bar: 1,
  buz: 2
}

var jsx = <div hello="world" {...foo} goodbye="moon">Nice!</div>
```

#### JavaScript
```js
var foo = {
  bar: 1,
  buz: 2
}

var jsx = {
  elementName: 'div',
  attributes: assign({
    hello: 'world'
  }, foo, {
    goodbye: 'moon'
  }),
  children: ['Nice!']
}
```

### Self Closing
Self closing JSX elements work just like self closing HTML elements. As they have no children, the children array will be null.

#### JSX
```jsx
var jsx = <br/>
```

#### JavaScript
```js
var jsx = {
  elementName: 'br',
  attributes: {},
  children: null
}
```

## A JSX Object
The names of properties in a JSX object are taken directly from the [spec][jsxs]. What the spec may call `JSXElementName`, in an object it is called `elementName` and so on. Currently properties to be expected are:

- `elementName`: A string specifying the JSX element’s name. Most often a string, but might be a variable if it is considered a valid expression by the JSX spec.
- `attributes`: An object of key/value attributes for the JSX object. Supports spread attributes.
- `children`: An array of various variables. Most often it will contain strings and JSX objects. If the JSX element was self closing this property will be `null`.

## Differences with [`babel-plugin-transform-react-jsx`][btrj] and [`babel-plugin-transform-react-inline-elements`][brie]

- No pragma or file import required. No longer is a `createElement` or similar function needed.
- No `$$typeof` or other extraneous JSX object information.
- No `props`, `key`, `ref`, or other specific React lingo.
- Does not support component element names. See more information below.

### No variable element names
With the React JSX transformer one might do the following:

```jsx
import MyFirstComponent from './MyFirstComponent'

function MySecondComponent() {
  return (
    <div>
      <MyFirstComponent/>
    </div>
  )
}
```

…where `MyFirstComponent` was a variable. This is **not** a defined behavior in the [JSX spec][jsxs] and only a React specific feature. Therefore it is not allowed in this plugin. One may however use a member expression which is a defined behavior by the spec. See the following example:

```jsx
var foo = {
  bar: 'div'
}

function MyComponent() {
  return (
    <div>
      <foo.bar/>
    </div>
  )
}
```

In the transformed object instead of having the string `foo.bar` for `elementName`, it would instead reference `foo.bar` the object property.

## Credits
If you like this plugin, follow me, [`@calebmer`][twcm], on Twitter. It will be great seeing you there and you can get updates of all the stuff I will be doing.

Thanks and enjoy 👍

[jsxs]: http://facebook.github.io/jsx/
[btrj]: https://www.npmjs.com/package/babel-plugin-transform-react-jsx
[brie]: https://www.npmjs.com/package/babel-plugin-transform-react-inline-elements
[twcm]: https://twitter.com/calebmer
