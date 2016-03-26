# babel-matrix
Describe input build syntaxes and output build syntaxes and let `babel-matrix` figure out your babel configuration for you.

There are so many different syntaxes you want to use, and so many targets to build to. NodeJS, the Browser, Webpack, Webpack with ES Module support, and the list goes on…

In addition there are hundreds of Babel plugins and all of their versions that you also have to worry about.

Well do not fear, `babel-matrix` is here! `babel-matrix` aims to make your Babel configuration *easy* to understand. Simply define a list of input syntaxes, for example `es6`, `esmodule`, `react`, and `flow`. A list of output syntaxes, like `es5` and `cjs`, and `babel-matrix` will get a list of all the babel plugins you will need to get from your ES6 React with Flow syntax to your CommonJS ES5 syntax for Webpack.

Supported syntaxes are:

- commonjs
- amd
- umd
- systemjs
- esmodule
- es5
- es6
- esnext
- react
- flow

And any more can be added at your request!

## API
This functions are exported as named properties on the object you get through `require`. So you can import: `import { getPlugins } from 'babel-matrix'`, or require: `var getPlugins = require('babel-matrix').getPlugins` like so.

### `getPlugins(inputSyntaxes: [string], outputSyntaxes: [string], isProduction: boolean): [object]`
This function takes a list of input syntaxes (e.g. `['es6', 'esmodule', 'react', 'flow']`) and a list of output syntaxes (e.g. `['es5', 'cjs']`) and return an array of the `require`d Babel plugins needed to transform your input syntaxes into your output syntaxes.

**Note:** If you do not have the packages `babel-matrix` expects in your `node_modules` directory, this function will not work. Look at the next function to get information to install your plugins.

### `getPluginSources(inputSyntaxes: [string], outputSyntaxes: [string], isProduction: boolean): [PluginSource]`
This function takes the same parameters as `getPlugins`, except instead of `require`ing the modules, it returns a list of objects. The objects returned in the list have two properties:

- `name`: This is the name used to `require` the plugin.
- `version`: This is the version of the plugin `name` we want.

If you don’t have the plugins pre-installed you should use this function to install the plugins first.
