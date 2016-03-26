import assert from 'assert'
import calebmer from '../src/index.js'

describe('index', () => {
  it('is it my name?', () => {
    assert.equal(calebmer.givenName, 'Caleb')
  })
})
