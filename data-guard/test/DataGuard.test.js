import assert from 'assert'
import DataGuard from '../lib/DataGuard'

describe('DataGuard', () => {
  it('exposes all of the validators', () => {
    assert(DataGuard.any)
    assert(DataGuard.string)
    assert(DataGuard.shape)
  })

  it('returns a super validator after calling one of the validators', () => {
    const testValidators = ['any', 'string', 'shape', 'required']
    testValidators.forEach(testValidator => {
      assert(DataGuard[testValidator]().any)
      assert(DataGuard[testValidator]().string)
      assert(DataGuard[testValidator]().shape)
      assert(DataGuard[testValidator]()[testValidator]().any)
      assert(DataGuard[testValidator]()[testValidator]().string)
      assert(DataGuard[testValidator]()[testValidator]().shape)
    })
  })
})
