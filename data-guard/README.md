# data-guard
Data validation is frustrating, let‘s fix that.

You can stop your search for a data validation library now. `data-guard` has you covered. Why should you not write your own data validations and just use `data-guard`? Well, because `data-guard` is:

- Small. Designed so that users don’t have to download a huge library just so you can do data validation.
- Flexible. `data-guard` will work in any context. By default validators will just return a boolean. If you want error messages you can use the special `validate` method. In addition `data-guard` has you covered for any function type validation needs.
- Functional. Functional programming is perhaps the easiest pattern to fit into your application. `data-guard` does not force you to write your code in a functional manner, but `data-guard` itself is written to be super compassable and useable with any framework in any codebase.

`data-guard` is not a JSON schema validator and does not plan to be. We want to keep `data-guard` as small as possible so you don‘t introduce unnecessary technical debt into your application. Also, most validators can be composed of the few powerful validators included with `data-guard`. Therefore we recommend you to try composing your validators before asking to add a new one. To see some common validations, see the [section](#common-validations) dedicated to it below.

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

Validators may also be chained together:

```js
var t = require('data-guard')

console.log(t.string().match(/@/)('hello, world'))     // => false
console.log(t.string().match(/@/)('person@email.com')) // => true
```

These design decisions allow for validators to be hyper flexible. If you want a validator, you just call one and you automatically have a function which you may pass around to other functions, and when called it returns a boolean saying if the value is valid. No specific domain knowledge required of your code, just functions and booleans. However, `data-guard` does have the capability to do more. See the following:

```js
var t = require('data-guard')
var validate = require('data-guard').validate

console.log(validate(t.string().match(/@/), 'hello, world'))
```

By using the validate function, you opt to pass in only the validator function (instead of calling it directly) and the value you wish to validate. This allows `data-guard` to get some extra information about the validation and it will now return the object:

```js
{
  success: false,
  results: [{
    path: '/',
    value: 'hello, world',
    errors: ['match']
  }]
}
```

The first TODO

## Validators

## Common Validations
