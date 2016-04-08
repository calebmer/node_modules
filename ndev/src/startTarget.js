import { exec } from 'shelljs'
import { NODE, WEB } from './constants.js'

async function startTarget (target, config) {
  const platform = target.getPlatform()
  switch (platform) {
    case NODE:
      await startTargetPlatformNode(target, config)
      return
    default:
      throw new Error(`Cannot use start command for target '${target.name}' which has a platform of '${platform}'.`)
  }
}

export default startTarget

async function startTargetPlatformNode (target, { watch }) {
  const entryOutputPath = target.getEntryOutputPath()

  if (watch) {
    let child = null
    // Build and watch the target.
    await target.watch(() => {
      if (child) {
        // If a child currently exists, kill it.
        child.kill()
      }
      // Spawn a new child.
      child = exec(`node ${entryOutputPath}`, { async: true })
    })
  } else {
    // Build the target and then wait for it’s node process to finish.
    await target.build()
    await new Promise((resolve, reject) => {
      exec(`node ${entryOutputPath}`, { async: true }, () => resolve())
    })
  }
}
