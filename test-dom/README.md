# test-dom
Ever wanted to test your React or other DOM based app in Node.js? Well luckily there is this great library called JSDOM that lets you interact with DOM structures in a Node.js environment. This package globally exposes an instance of JSDOM when required making it super easy to use in your tests. Just:

```js
// Require…
require('test-dom')

// …and profit!
document.createElement('div')
```

The library itself is under 20 lines of code. This is it:

```js
var jsdom = require('jsdom').jsdom
var window = jsdom('<body></body>').defaultView
global.window = window
global.document = window.document
global.navigator = window.navigator
```
