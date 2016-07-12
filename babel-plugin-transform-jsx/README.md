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

No JSX pragma needed and no `/* @jsx */` comments needed (although constructor functions are supported).

## A JSX Object
The names of properties in a JSX object are taken directly from the [spec][jsxs]. What the spec may call `JSXElementName`, in an object it is called `elementName` and so on. Currently properties to be expected are:

- `elementName`: A string specifying the JSX element’s name. Most often a string, but might be a variable if it is considered a valid expression by the JSX spec.
- `attributes`: An object of key/value attributes for the JSX object. Supports spread attributes.
- `children`: An array of various variables. Most often it will contain strings and JSX objects. If the JSX element was self closing this property will be `null`.

## Options
This plugin accepts options in the standard babel fashion, such as the following:

- `module`: The module to be imported and default export used to construct JSX objects.
- `function`: The function name to be used for constructing JSX objects.
- `useNew`: Instead of calling a constructor function (as defined using an earlier option) use `new`.
- `useVariables`: Allow elements to reference variables, enabling component element names. When set to `true`, element names with an uppercase letter from A to Z are treated as variables. When set to a regular expression pattern, matching names are treated as variables.
- `noTrim`: Specifies whether or not we should trim space in strings. To understand more about trimming, see the [Trimming](#trimming) example below. Defaults to false.

## How to integrate with your framework
To integrate this JSX transformer with your framework of choice, you must first define a constructor function which takes a single argument (a JSX object) and returns the appropriate format for your framework. After that, you could take one of two approaches:

1. Ask users to add your constructor function‘s name to their plugin config under the `function` key. The user will need to manually bring the constructor function into every file‘s scope which uses JSX (this is comparable to React requiring the `react` module to be in every file).
2. Create a file where your constructor function is a default export and ask the user to add the file name to their plugin config under the `module` key. This file will be brought into the JSX file‘s scope using ES6 modules automatically.

   For the majority of users the algorithm to locate the file will be node‘s standard require algorithm. Therefore, It is recommended to name your file `jsx.js` and place it at the root of your package so user may use `your-module/jsx` to get the constructor function.

### Example `jsx.js` file
If you are taking the second approach, and you are using the [`virtual-dom`][vdom] library an example `jsx.js` may look as follows:

```js
var h = require('virtual-dom/h')

module.exports = function jsx(jsxObject) {
  return h(
    jsxObject.elementName,
    jsxObject.attributes,
    jsxObject.children
  )
}
```

## Differences with [`babel-plugin-transform-react-jsx`][btrj] and [`babel-plugin-transform-react-inline-elements`][brie]

- No more `createElement` or other pragma or file import required, but is supported via the `function` and `module` options.
- No `$$typeof`, `props`, `key`, `ref`, or other specific React lingo.
- Does not support component element names by default, though support is available via the `useVariables` option.

## Examples
### Basic
#### JSX
```jsx
var object = (
  <article>
    <h1>Hello, kitten!</h1>
    <img href="http://placekitten.com/200/300" alt="A cute kitten"/>
    It is soooo cute.
  </article>
)
```

#### JavaScript
```js
var object = {
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

var object = <div hello="world" {...foo} goodbye="moon">Nice!</div>
```

#### JavaScript
```js
var foo = {
  bar: 1,
  buz: 2
}

var object = {
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
var object = <br/>
```

#### JavaScript
```js
var object = {
  elementName: 'br',
  attributes: {},
  children: null
}
```

### Constructor Function
If you want your JSX object to have a constructor function use Babel options to specify a function name.

#### Options
```json
{
  "plugins": [["transform-jsx", { "function": "jsx" }]]
}
```

#### JSX
```jsx
var object = (
  <p>
    <strong>Hello,</strong> world!
  </p>
)
```

#### JavaScript
```js
var object = jsx({
  elementName: 'p',
  attributes: {},
  children: [
    jsx({
      elementName: 'string',
      attributes: {},
      children: ['Hello,']
    }),
    ' world!'
  ]
})
```

### Constructor Module
Sometimes it is annoying to have to import your constructor function in every file, so this plugin provides a way to automagically import your constructor function.

A couple things to consider: First, instead of using the NodeJS only `require` function this plugin adds an ES2015 module import declaration. So in a `import … from '…'` format. Therefore, you will also need a transformation plugin for this style of import if your platform does not support it.

Second, this plugin uses the default export. If you are using CommonJS `module.exports` you should be fine as long as the constructor is the value of `module.exports`.

#### Options
```json
{
  "plugins": [["transform-jsx", { "module": "jsx-module-thing" }]]
}
```

#### JSX
```jsx
var object = (
  <p>
    <strong>Hello,</strong> world!
  </p>
)
```

#### JavaScript
```js
import _jsx from 'jsx-module-thing'

var object = _jsx({
  elementName: 'p',
  attributes: {},
  children: [
    _jsx({
      elementName: 'string',
      attributes: {},
      children: ['Hello,']
    }),
    ' world!'
  ]
})
```

### Variable Element Names
The React JSX transformer allows you to use variable names for elements. For example `<MyFirstComponent propA={valueA}/>`. By default, this plugin does not allow that behavior as it is not defined in the [JSX spec][jsxs] and rather a React specific feature. If you would like to use a variable for your component use the `useVariables` option. If it is `true` any JSX element written in PascalCase (first letter is uppercase, A–Z) will be a variable. Otherwise you can use a regular expression string if you want more fine grained control.

#### Options
```json
{
  "plugins": [["transform-jsx", { "useVariables": true }]]
}
```

#### JSX
```jsx
var object = (
  <p>
    <MyStrong foo="bar">Hello,</MyStrong> world!
  </p>
)
```

#### JavaScript
```js
var object = {
  elementName: 'p',
  attributes: {},
  children: [
    {
      elementName: MyStrong,
      attributes: { foo: 'bar' },
      children: ['Hello,']
    },
    ' world!'
  ]
}
```

### Trimming
This JSX transformer will try to optimize your JSX text elements by “trimming” away unnesesary strings. What does that mean? Any length space in your string that starts with a new line character (`\n`) because in *most* scenarios that’s just indentation. So for example JSX that looks like this:

```jsx
var jsx = (
  <p>
    <strong>Hello,</strong> world!
  </p>
)
```

…would (without trimming) turn into something like this:

```js
var jsx = {
  elementName: 'p',
  attributes: {},
  children: ['\n    ', {
    elementName: 'strong',
    attributes: {},
    children: ['Hello,']
  }, ' world!\n  '],
}
```

Notice all the extra space leftover from where we indented our code? This plugin will trim that extra space to create a result that looks like:

```js
var jsx = {
  elementName: 'p',
  attributes: {},
  children: [{
    elementName: 'strong',
    attributes: {},
    children: ['Hello,']
  }, ' world!'],
}
```

Which is more like what the author really wanted the JSX to transform to. If you want to preserve the white space that gets trimmed, set the `noTrim` option to `true`.

If you really need a space somewhere this JSX transformer is trimming it, just us a JS-escape like so:

```jsx
var jsx = (
  <div>
    Hello, world!{' '}
    Hello world again!
  </div>
)
```

> For pre-2.0.0 users, the original trimming algorithm was similar to what you’d find in a browser. Any whitespace of more than one character was collapsed into a single space string. The trimming method in 2.0.0 and on removes this browser-specific behavior for a method that’s more universal.

* * *

## Credits
If you like this plugin, follow me, [`@calebmer`][twcm], on Twitter. It will be great seeing you there and you can get updates of all the stuff I will be doing.

Thanks and enjoy 👍

[jsxs]: http://facebook.github.io/jsx/
[btrj]: https://www.npmjs.com/package/babel-plugin-transform-react-jsx
[brie]: https://www.npmjs.com/package/babel-plugin-transform-react-inline-elements
[twcm]: https://twitter.com/calebmer
[vdom]: https://www.npmjs.com/package/virtual-dom
