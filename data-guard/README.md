# data-guard
Data validation is frustrating, let‘s fix that.

You can stop your search for a data validation library now. `data-guard` has you covered. Why should you not write your own data validations and just use `data-guard`? Well, because `data-guard` is:

- Small. Designed so that users don’t have to download a huge library just so you can do data validation.
- Flexible. `data-guard` will work in any context. By default validators will just return a boolean. If you want error messages you can use the special `validate` method. In addition `data-guard` has you covered for any function type validation needs.
- Functional. Functional programming is perhaps the easiest pattern to fit into your application. `data-guard` does not force you to write your code in a functional manner, but `data-guard` itself is written to be super compassable and useable with any framework in any codebase.

`data-guard` is not a JSON schema validator and does not plan to be. We want to keep `data-guard` as small as possible so you don‘t introduce unnecessary technical debt into your application.

For more information on a React `propTypes` style usage, look at the [Guarding function arguments](#guarding-function-arguments) section!

## Need more?
See something missing that is a blocker for your use of `data-guard`, well instead of writing your own data validation library consider opening an issue. This not only means you can use `data-guard`, but everyone else who uses it both now and in the future can benefit from your feature request. Let‘s stop using a hundred different data validation frameworks and finally just agree on one.

## Usage
Validators accept two parameters in a curried fashion, a config, and a value. For example, the array validator:

```js
var t = require('data-guard')

t.items(t.string())(['a', 'b', 'c'])
```

Represents a validator which ensures that all items in an array are strings. Validators also only return a boolean. `true` if the validation succeeded, `false` if it failed. For example, see the following:

```js
var t = require('data-guard')

console.log(t.string()('hello, world'))       // => true
console.log(t.string()(2))                    // => false
console.log(t.items(t.number())([1, 2, 'c'])) // => false
console.log(t.items(t.number())([4, 5, 6]))   // => true
```

### Chaining validators
Validators may also be chained together:

```js
var t = require('data-guard')

console.log(t.string().match(/@/)('hello, world'))     // => false
console.log(t.string().match(/@/)('person@email.com')) // => true
```

These design decisions allow for validators to be hyper flexible. If you want a validator, you just call one and you automatically have a function which you may pass around to other functions, and when called it returns a boolean saying if the value is valid. No specific domain knowledge required of your code, just functions and booleans. However, `data-guard` does have the capability to do more. See the following:

### Getting more information about the validation
```js
var t = require('data-guard')
var validate = require('data-guard').validate

console.log(validate(t.string().match(/@/), 'hello, world'))
```

By using the validate function, you opt to pass in only the validator function (instead of calling it directly) and the value you wish to validate. This allows `data-guard` to get some extra information about the validation and it will now return the object:

```js
{
  success: false,
  details: [{
    path: '/',
    value: 'hello, world',
    errors: ['match']
  }]
}
```

The object will always have a `success` boolean, which is just the boolean value the validator would have returned if called correctly. The `results` array will contain an object for every failed path in the validation. A `path` is defined as a JSON pointer and is useful for identifying the field in an object or array environment. For example:

```js
var validator = t.shape({
  foo: t.string(),
  bar: t.number()
})

var value = {
  foo: 42,
  bar: 'buz'
}

validate(validator, value)
```

Would return:

```js
{
  success: false,
  details: [{
    path: '/',
    value: { ... },
    errors: ['shape']
  }, {
    path: '/foo',
    value: 42,
    errors: ['string']
  }, {
    path: '/bar',
    value: 'buz',
    errors: ['number']
  }]
}
```

If multiple validators return an error, all of those errors will be represented in the returned object.

By calling `validate.strict(...)` instead of `validate(...)`, the function will throw an error on the first failed validator.

### Guarding function arguments
Because `data-guard` really likes functional programming, it also provides a decorator function so you can “guard” your own functions. Making them pseudo-type-safe.

```js
var t = require('data-guard')
var guard = require('data-guard').guard

function multiply(a, b) {
  return a * b
}

var guardedMultiply = guard(t.number(), t.number())(multiply)
```

Now, if you call `guardedMultiply` with a value of the wrong type, say a string, it will warn you in the console. If you would rather fail instead of warn on a bad validation use `guard.strict(...)` instead of `guard(...)`.

The `guard` function will take any number of parameters. These parameters are expected to be functions which return a boolean. For each validator passed to `guard`, the argument in the same place in the decorated function will be validated using that validator.

This function was inspired by React’s `propTypes`.

## Validators
The validators bundled with `data-guard` by default are:

- `any`: Always returns true.
- `boolean`: Value is optionally a boolean type.
- `number`: Value is optionally a number type.
- `string`: Value is optionally a string type.
- `object`: Value is optionally an object type.
- `array`: Value is optionally an array type.
- `function`: Value is optionally a function type.
- `required`: Value may not be null or undefined.
- `shape`: Value must conform to a certain object shape. Must be passed an object parameter.
- `items`: All items in the value array must conform to the passed validator. May be passed a shape.
- `match`: Matches a string to a regular expression.
- `enum`: Value must be exactly one of the values passed in.
- `instanceOf`: Value must pass an `instanceof` check with the supplied function.

If there is another low level validator you would like to see, please open an issue or submit a PR!

## Credits
If you use and enjoy this module, the best way to show your gratitude is to follow me, [`@calebmer`](https://twitter.com/calebmer), on Twitter.
