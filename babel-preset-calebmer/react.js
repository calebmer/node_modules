module.exports = function preset (context, opts) {
  const production = Boolean(opts.production || process.env.NODE_ENV === 'production')

  return {
    plugins: [
      require('babel-plugin-transform-react-jsx'),
      require('babel-plugin-syntax-jsx'),
      require('babel-plugin-transform-react-display-name'),
      !production && require('babel-plugin-transform-react-jsx-source'),
      !production && require('babel-plugin-transform-react-jsx-self'),
      production && require('babel-plugin-transform-react-inline-elements'),
      production && require('babel-plugin-transform-react-constant-elements'),
      production && require('babel-plugin-transform-react-remove-prop-types'),
      production && require('babel-plugin-transform-react-pure-class-to-function'),
    ].filter(Boolean)
  }
}
