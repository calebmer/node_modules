module.exports = function preset (context, opts) {
  const modules = Boolean(opts.modules)
  const production = Boolean(opts.production || process.env.NODE_ENV === 'production')
  const loose = production

  return {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in OS temporary directory for faster rebuilds.
    cacheDirectory: !production,

    plugins: [
      // [es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
      [require('babel-plugin-transform-es2015-template-literals'), { loose }],
      require('babel-plugin-transform-es2015-literals'),
      require('babel-plugin-transform-es2015-function-name'),
      [require('babel-plugin-transform-es2015-arrow-functions')],
      require('babel-plugin-transform-es2015-block-scoped-functions'),
      [require('babel-plugin-transform-es2015-classes'), { loose }],
      require('babel-plugin-transform-es2015-object-super'),
      require('babel-plugin-transform-es2015-shorthand-properties'),
      require('babel-plugin-transform-es2015-duplicate-keys'),
      [require('babel-plugin-transform-es2015-computed-properties'), { loose }],
      [require('babel-plugin-transform-es2015-for-of'), { loose }],
      require('babel-plugin-transform-es2015-sticky-regex'),
      require('babel-plugin-transform-es2015-unicode-regex'),
      require('babel-plugin-check-es2015-constants'),
      [require('babel-plugin-transform-es2015-spread'), { loose }],
      require('babel-plugin-transform-es2015-parameters'),
      [require('babel-plugin-transform-es2015-destructuring'), { loose }],
      require('babel-plugin-transform-es2015-block-scoping'),
      require('babel-plugin-transform-es2015-typeof-symbol'),
      !modules && [require('babel-plugin-transform-es2015-modules-commonjs'), { loose }],
      [require('babel-plugin-transform-regenerator'), { async: false, asyncGenerators: false }],

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
