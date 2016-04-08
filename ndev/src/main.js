import { Command } from 'commander'
import path from 'path'
import fs from 'fs-promise'
import toml from 'toml'
import jsen from 'jsen'
import manifest from '../package.json'
import configSchema from '../config-schema.json'
import Target from './Target.js'
import startTarget from './startTarget.js'

const validateConfig = jsen(configSchema, { greedy: true })

const program = new Command('ndev')

program
.version(manifest.version)

program
.command('start <target>')
.description('start the specified target')
.option('-w, --watch', 'watch the source code for changes and rebuild with new information')
.action((targetName, options) => {
  Promise.resolve()
  .then(() => getTarget(targetName))
  .then(target => startTarget(target, options))
  .catch(handleError)
})

program.parse(process.argv)

async function getTarget (targetName) {
  const config = await getConfig()
  return new Target(targetName, config)
}

async function getConfig () {
  const configToml = await fs.readFile('project.toml')
  const config = toml.parse(configToml)
  const valid = validateConfig(config)
  if (!valid) {
    const lastError = validateConfig.errors.pop()
    throw new Error(`Config is invalid at the path '${lastError.path}' for the JSON schema keyword '${lastError.keyword}'.`)
  }
  validateConfig.build(config)
  return config
}

function handleError (error) {
  console.error(error.stack)
}
