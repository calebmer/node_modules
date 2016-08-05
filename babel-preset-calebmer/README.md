# babel-preset-calebmer
This Babel preset holds plugins that make modern JavaScript development with a Babel compiler much easier. This package also bundles *all* of the dependencies, which means the npm install time is fast.

What’s included?

- All the ES2015 transforms. ES module transformation can be configured using a `modules` option (true if you don’t want modules compiled into CommonJS).
- All of the ES2016 transforms.
- Assorted proposal transforms, including: trailing commas, async functions, class properties, object rest spread, export extensions, and function bind.
- React transforms with extra development and production transforms. Use the `production` option to configure.
- Loose mode in supported transforms. Use the `production` option to configure.
