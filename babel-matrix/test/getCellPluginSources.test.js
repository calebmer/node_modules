import assert from 'assert'
import * as s from '../src/syntaxes.js'
import getCellPluginSources from '../src/getCellPluginSources.js'

describe('getCellPluginSources', () => {
  it('can’t find plugins for input basic module systems', () => {
    assert.throws(() => getCellPluginSources(s.COMMON_JS, s.AMD))
    assert.throws(() => getCellPluginSources(s.AMD, s.AMD))
    assert.throws(() => getCellPluginSources(s.UMD, s.SYSTEM_JS))
    assert.throws(() => getCellPluginSources(s.SYSTEM_JS, s.COMMON_JS))
    assert.equal(getCellPluginSources(s.SYSTEM_JS, s.REACT).length, 0)
    assert.equal(getCellPluginSources(s.SYSTEM_JS, s.ES5).length, 0)
  })

  it('will always add the strict module for es modules', () => {
    assert.equal(getCellPluginSources(s.ES_MODULES, s.COMMON_JS).length, 2)
    assert.equal(getCellPluginSources(s.ES_MODULES, s.AMD).length, 2)
    assert.equal(getCellPluginSources(s.ES_MODULES, s.UMD).length, 2)
    assert.equal(getCellPluginSources(s.ES_MODULES, s.SYSTEM_JS).length, 2)
    assert.equal(getCellPluginSources(s.ES_MODULES, s.REACT).length, 1)
    assert.equal(getCellPluginSources(s.ES_MODULES, s.ES6).length, 1)
    assert.equal(getCellPluginSources(s.ES_MODULES, s.ESNEXT).length, 1)
  })

  it('won’t build old versions to future versions', () => {
    assert.throws(() => getCellPluginSources(s.ES5, s.ES6))
    assert.throws(() => getCellPluginSources(s.ES5, s.ESNEXT))
    assert.throws(() => getCellPluginSources(s.ES6, s.ESNEXT))
  })

  it('will add lot’s of plugins for large presets', () => {
    assert.equal(getCellPluginSources(s.ES6, s.ES5).length, 20)
    assert.equal(getCellPluginSources(s.ESNEXT, s.ES6).length, 10)
    assert.equal(getCellPluginSources(s.ESNEXT, s.ES5).length, 30)
  })

  it('singular features will always add their plugins unless they are there', () => {
    assert.equal(getCellPluginSources(s.REACT, s.ES5).length, 3)
    assert.equal(getCellPluginSources(s.REACT, s.REACT).length, 0)
    assert.equal(getCellPluginSources(s.FLOW, s.REACT).length, 2)
    assert.equal(getCellPluginSources(s.FLOW, s.FLOW).length, 0)
  })

  it('react will add extra plugins in production', () => {
    assert.equal(getCellPluginSources(s.REACT, s.ES5, true).length, 5)
  })
})
