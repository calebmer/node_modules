# `eslint-config-calebmer`
An opinionated eslint config with attitude 😘

Based on the [standard][] coding style except more strict and more opinions.

[standard]: http://npmjs.org/standard

## Features
- Enhanced [promise][] rules.
- [ES module][] static linting configuration which checks for existing imports/exports.
- [JSDoc][] specific rules for the best documentation in the land!

[promise]: http://npmjs.org/eslint-plugin-promise
[es module]: https://www.npmjs.com/package/eslint-plugin-import
[jsdoc]: https://www.npmjs.com/package/eslint-plugin-jsdoc

## Bikeshedding
If you don’t like a rule, we can do some bikeshedding, just open an issue. If we can’t quickly come to a resolution, my subjective preference wins out.

Warrants for some rules are below.

## Warrants
Some of the decisions made in this config may be controversial, or I may forget why I made them. Therefore here are my warrants for some of the more controversial decisions made in this config.

### [`semi`][]
Semicolons are disabled. I don’t want to write any more characters than I have to. Deal with it 😎

[`semi`]: http://eslint.org/docs/rules/semi

### [`brace-style`][]
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

[`brace-style`]: http://eslint.org/docs/rules/brace-style
