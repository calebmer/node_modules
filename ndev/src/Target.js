import path from 'path'
import { noop, compact } from 'lodash'
import Compiler, { optimize, DefinePlugin } from 'webpack'
import { getPluginSources, COMMON_JS, AMD, UMD } from 'babel-matrix'
import NpmInstallPlugin from 'npm-install-webpack-plugin'
import { IS_PRODUCTION, WEB, NODE } from './constants.js'
import { ensureDependency } from './npm.js'

class Target {
  static webpackTarget = null

  constructor (name, globalConfig, targetConfig = globalConfig[name]) {
    this.context = process.cwd()
    this.name = name
    this.globalConfig = globalConfig
    this.targetConfig = targetConfig
    const { input, ourput } = this.targetConfig
    this.babelPluginSources = getPluginSources(input, output, IS_PRODUCTION)
    this.compiler = this.createCompiler()
  }

  createCompiler () {
    const { directory, output } = this.globalConfig
    const { library, entry } = this.targetConfig

    return new Compiler({
      context: this.context,
      target: this.constructor.webpackTarget,
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
              plugins: this.babelPluginSources.map(({ name }) => name)
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

  async ensureDependencies () {
    await this.babelPluginSources.map(({ name, version }) => ensureDependency(name, version))
  }

  build () {
    return new Promise((resolve, reject) => {
      this.compiler.run((error, stats) => {
        if (error) {
          return reject(error)
        } else {
          console.log(stats.toString({ color: true }))
          return resolve()
        }
      })
    })
  }

  watch (onBuildFinished = noop) {
    const compiler = await this.getCompiler()
    const watcher = compiler.watch((error, stats) => {
      if (error) {
        console.error(error.stack)
        return
      }
      console.log(stats.toString({ colors: true }))
      onBuildFinished()
    })
    return watcher.close
  }
}

export default Target
