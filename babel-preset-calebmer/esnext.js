module.exports = {
  plugins: [
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
  ]
}
