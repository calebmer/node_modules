import assert from 'assert'
import guard from '../src/guard'
import * as v from '../src/Validators'

describe('guard()', () => {
  const guardArgs = [v.number(), v.string()]

  it('wraps a function', () => {
    const value = { a: 1, b: 2 }
    const func = () => value
    const guardedFunc = guard()(func)
    assert.equal(func(), guardedFunc())
  })

  it('will log an error', () => {
    const guardedFunc = guard(...guardArgs)(() => true)
    guardedFunc('asd', 3, 5)
    guardedFunc(2, 8, 5, 6, [])
  })

  it('has a strict mode', () => {
    const guardedFunc = guard.strict(...guardArgs)(() => true)
    assert.throws(() => guardedFunc('asd', 3, 5), /wrong type/i)
  })
})
