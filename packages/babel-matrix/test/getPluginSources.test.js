import assert from 'assert'
import * as s from '../src/syntaxes.js'
import getPluginSources from '../src/getCellPluginSources.js'

describe('getPluginSources', () => {
  it('gets all the combinations of syntaxes', () => {
    assert.equal(
      getPluginSources(
        [s.ESNEXT, s.ES_MODULES, s.REACT, s.FLOW],
        [s.ES5, s.UMD]
      ).length,
      0
    )
  })
})
