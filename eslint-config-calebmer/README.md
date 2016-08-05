# `eslint-config-calebmer`
An opinionated eslint config with attitude 😘

Based on the [standard][] coding style except more strict and more opinions.

[standard]: http://npmjs.org/standard

## Features
- Enhanced [promise][] rules.
- [ES module][] static linting configuration which checks for existing imports/exports.
- [JSDoc][] specific rules for the best documentation in the land!
- Test environment (via `calebmer/tests`) with [Mocha][] specific rules.
- [Markdown][] code block linting. Just remember to run eslint with an extension argument: `eslint --ext md …`.

[promise]: http://npmjs.org/eslint-plugin-promise
[es module]: https://www.npmjs.com/package/eslint-plugin-import
[jsdoc]: https://www.npmjs.com/package/eslint-plugin-jsdoc
[mocha]: https://www.npmjs.com/package/eslint-plugin-mocha
[markdown]: https://www.npmjs.com/package/eslint-plugin-markdown

## Bikeshedding
If you don’t like a rule, we can do some bikeshedding, just open an issue. If we can’t quickly come to a resolution, my subjective preference wins out.

Warrants for some rules are below.

## Warrants
Some of the decisions made in this config may be controversial, or I may forget why I made them. Therefore here are my warrants for some of the more controversial decisions made in this config.

**Table of contents:**

- [Semicolons](#semicolons)
- [Brace Style](#brace-style)
- [Comma Dangle](#comma-dangle)
- [No Namespace Imports](#no-namespace-imports)

### [Semicolons][]
Semicolons are disabled. I don’t want to write any more characters than I have to. Deal with it 😎

[Semicolons]: http://eslint.org/docs/rules/semi

### [Brace Style][]
The brace style is configured to Stroustrup. This forces braces from if/else statements to act like this:

```js
// Yep 👍

if (foo) {
  bar()
}
else {
  baz()
}
```

…instead of the more common style *one true brace style* which looks like this:

```js
// Nope 😫

if (foo) {
  bar()
} else {
  baz()
}
```

There are three reasons for choosing Stroustrup.

#### 1. Documentation
When doing algorithm documentation for if/else statements it is very hard to decide where to write documentation with the “one true brace style.” Do you write documentation at the start of the if/else block? Do you write documentation inside the if/else blocks? To demonstrate:

```js
// Does documentation go here?
if (foo) {
  // Or here?
  bar()
// But definetly not here…
} else {
  // If it goes here it may be confused for documenting `baz` instead of the block as a whole.
  baz()
}
```

But with Stroustrup documenting if/else blocks is easy.

```js
// Document the if here. 👍
if (foo) {
  bar()
}
// Document the else here. 🎉
else {
  baz()
}
```

#### 2. Consistency
You would *never* write this:

```js
function hello () {
  // Stuff…
} function world () {
  // Other stuff…
}
```

Or if/if statements like this:

```js
if (foo) {
  // Stuff…
} if (bar) {
  // Other stuff… 😯
} try {
  // More stuff… 😵
} catch (error) {
  // Yeah, no stuff here 😉
}
```

So why write your if/else blocks or try/catch blocks that way? One argument may be that if/else and try/catch blocks are one piece of application logic, to counter that take a look at promises:

```js
asyncWork()
.then(foo => {
  // More async work… 🤔
})
.then(bar => {
  // Finish async work…
})
.catch(noop)
```

This configuration prefers the above code over:

```js
// Yikes! 😟
asyncWork()
.then(foo => {
  // More async work…
}).then(bar => {
  // Finish async work…
}).catch(noop)
```

As this choice in method chaining ends up acting very similar to if/else blocks (in a logic sense), we pick Stroustrup for consistency.

#### 3. Spacing
The so called “one true brace style” can get very compact and become almost unreadable with lots of `else if`s.

```js
if (foo) {
  bar()
} else if (baz) {
  bux()
} else {
  quz()
}
```

[brace style]: http://eslint.org/docs/rules/brace-style

### [Comma Dangle][]
Inspired by “[Why you should enforce Dangling Commas for Multiline Statements][]” this configuration enforces dangling commas for multiline statements. So the following code is invalid:

```js
// Yeah, no…

const array = [
  'foo',
  'bar',
  'buz'
]
```

But the following code is valid:

```js
// Yay! 🎉

const array = [
  'foo',
  'bar',
  'buz',
]
```

Note that the only difference between the two examples is a *single comma*. For the main argument, read the article linked to earlier, but the gist of the article is that enforcing dangling commas for multiline statements is preferable because you only have to change one line instead of two when adding an item to a multiline object.

This has two impacts:

1. Better git diffs.
2. Easier to edit.

Therefore this rule is enforced in this configuration.

[Comma Dangle]: http://eslint.org/docs/rules/comma-dangle
[Why you should enforce Dangling Commas for Multiline Statements]: https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8

### [No Namespace Imports][]
If you try to import values from an ES module like so:

```js
import * as foo from './foo'
```

You *will* get an error.

Why is this? Well because doing this can lead to importing *everything* from a module. This is an anti-pattern when you are code splitting your modules trying to make the smallest build possible. Instead of depending on a namespace import, instead use a default export object like so:

```js
export default {
  foo: 1,
  bar: 2,
  baz: 3,
}
```

This way you are more explicit about your intent for the exports.

Ultimately, named exports should be used when you want the user to be selective about their module imports.
