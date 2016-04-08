import path from 'path'
import { noop, compact } from 'lodash'
import Compiler, { optimize, DefinePlugin } from 'webpack'
import { getPluginSources, COMMON_JS, AMD, UMD } from 'babel-matrix'
import NpmInstallPlugin from 'npm-install-webpack-plugin'
import { IS_PRODUCTION, WEB, NODE } from './constants.js'
import { ensureDependency } from './npm.js'

class Target {
  constructor (name, globalConfig, targetConfig = globalConfig[name]) {
    this.name = name
    this.context = process.cwd()
    this.globalConfig = globalConfig
    this.targetConfig = targetConfig
  }

  getEntryOutputPath () {
    return path.join(this.context, this.globalConfig.output, this.name, path.basename(this.targetConfig.entry))
  }

  getPlatform () {
    const { platform } = this.targetConfig
    // Returns the platform specified in the target config first, otherwise we
    // try to intelligently detect the platform from the name.
    if (platform) {
      return platform
    } else if (this.name === 'web' || this.name === 'browser' || this.name === 'client') {
      return WEB
    } else if (this.name === 'node' || this.name === 'server') {
      return NODE
    } else {
      return null
    }
  }

  async getEnsuredBabelPluginNames () {
    const { input, ourput } = this.targetConfig
    // Use `babel-matrix` to get our plugin sources.
    const pluginSources = getPluginSources(input, output, IS_PRODUCTION)
    // Map over plugin sources and ensure the dependency to get an array of
    // Promises. Wait for the promises to resolve before continuing.
    await pluginSources.map(({ name, version }) => ensureDependency(name, version))
    // Map the plugin sources to just their names and return it.
    return pluginSources.map(({ name }) => name)
  }

  async build () {
    const compiler = await this.getCompiler()
    return await new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        if (error) {
          // If there is an error, reject the promise.
          return reject(error)
        }
        // Otherwise, log the build stats.
        console.log(stats.toString({ colors: true }))
        resolve()
      })
    })
  }

  async watch (onBuildFinished = noop) {
    const compiler = await this.getCompiler()
    const watcher = compiler.watch((error, stats) => {
      if (error) {
        // Print the error stack trace if it happened.
        console.error(error.stack)
        return
      }
      // Otherwise, log the stats and run the callback.
      console.log(stats.toString({ colors: true }))
      onBuildFinished()
    })
    return watcher.close
  }

  async getCompiler () {
    const { directory, output } = this.globalConfig
    const { library, entry } = this.targetConfig

    return new Compiler({
      context: this.context,
      target: this.getPlatform(),
      devtool: !IS_PRODUCTION ? 'cheap-eval-source-map' : null,
      entry,
      output: {
        // Builds the target’s stuff to a sub directory of our output
        // directory. If `output` is `dist` and `this.name` is server, the path
        // would be `/dist/server`.
        path: path.join(this.context, output, this.name),
        // Our built file uses the same name as our entry file.
        filename: path.basename(entry),
        library,
        // Use the first module output format found via `babel-matrix`.
        // TODO: Consider moving this to `babel-matrix`.
        libraryTarget: output.find(s => s === COMMON_JS || s === AMD || s === UMD)
      },
      resolve: {
        root: [path.join(this.context, directory)],
        alias: {
          '#': path.join(this.context, directory)
        }
      },
      module: {
        loaders: [
          {
            test: /\.js[xm]?$/,
            include: [directory],
            exclude: /node_modules|bower_components/,
            loader: 'babel-loader',
            query: {
              plugins: await this.getEnsuredBabelPluginNames()
            }
          }
        ]
      },
      plugins: compact([
        new DefinePlugin({
          DEVELOPMENT: !IS_PRODUCTION,
          PRODUCTION: IS_PRODUCTION
        }),
        IS_PRODUCTION ? new optimize.OccurrenceOrderPlugin(true) : null,
        IS_PRODUCTION ? new optimize.DedupePlugin() : null,
        IS_PRODUCTION ? new optimize.UglifyJsPlugin() : null,
        !IS_PRODUCTION ? new NpmInstallPlugin({ save: true }) : null
      ])
    })
  }
}

export default Target
