module.exports = function preset (context, opts) {
  const es2015 = Boolean(opts.es2015)
  const modules = Boolean(opts.modules)
  const production = Boolean(opts.production || process.env.NODE_ENV === 'production')
  const loose = production

  return {
    plugins: [
      // [es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
      es2015 && [require('babel-plugin-transform-es2015-template-literals'), { loose }],
      es2015 && require('babel-plugin-transform-es2015-literals'),
      es2015 && require('babel-plugin-transform-es2015-function-name'),
      es2015 && [require('babel-plugin-transform-es2015-arrow-functions')],
      es2015 && require('babel-plugin-transform-es2015-block-scoped-functions'),
      es2015 && [require('babel-plugin-transform-es2015-classes'), { loose }],
      es2015 && require('babel-plugin-transform-es2015-object-super'),
      es2015 && require('babel-plugin-transform-es2015-shorthand-properties'),
      es2015 && require('babel-plugin-transform-es2015-duplicate-keys'),
      es2015 && [require('babel-plugin-transform-es2015-computed-properties'), { loose }],
      es2015 && [require('babel-plugin-transform-es2015-for-of'), { loose }],
      es2015 && require('babel-plugin-transform-es2015-sticky-regex'),
      es2015 && require('babel-plugin-transform-es2015-unicode-regex'),
      es2015 && require('babel-plugin-check-es2015-constants'),
      es2015 && [require('babel-plugin-transform-es2015-spread'), { loose }],
      es2015 && require('babel-plugin-transform-es2015-parameters'),
      es2015 && [require('babel-plugin-transform-es2015-destructuring'), { loose }],
      es2015 && require('babel-plugin-transform-es2015-block-scoping'),
      es2015 && require('babel-plugin-transform-es2015-typeof-symbol'),
      es2015 && [require('babel-plugin-transform-regenerator'), { async: false, asyncGenerators: false }],

      // import foo from './bar'
      !modules && [require('babel-plugin-transform-es2015-modules-commonjs'), { loose }],

      // [es2016](https://github.com/babel/babel/tree/master/packages/babel-preset-es2016)
      require('babel-plugin-transform-exponentiation-operator'),

      // function x(a, b, c,) {}
      require('babel-plugin-syntax-trailing-function-commas'),
      // await fetch()
      require('babel-plugin-syntax-async-functions'),
      // class { handleClick = () => { } }
      require('babel-plugin-transform-class-properties'),
      // { ...todo, completed: true }
      require('babel-plugin-transform-object-rest-spread'),
      // export foo from './bar'
      require('babel-plugin-transform-export-extensions'),
      // foo::bar()
      require('babel-plugin-transform-function-bind'),
    ].filter(Boolean)
  }
}
