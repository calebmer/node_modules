import assert from 'assert'
import isFunction from 'lodash/isFunction'
import createSuperValidator from '../lib/createSuperValidator'

describe('createSuperValidator()', () => {
  it('will create a function with all the validators as properties', () => {
    assert(isFunction(createSuperValidator()))
    assert(createSuperValidator().any)
    assert(createSuperValidator().string)
    assert(createSuperValidator().shape)
  })

  it('can chain validators', () => {
    const superValidator = createSuperValidator().any().string().shape()
    assert(isFunction(createSuperValidator()))
    assert(createSuperValidator().any)
    assert(createSuperValidator().string)
    assert(createSuperValidator().shape)
  })

  it('will create new super validators when chaining', () => {
    const superValidator = createSuperValidator()
    assert.notEqual(superValidator, superValidator.string())
  })

  it('will run all validators', () => {
    assert(createSuperValidator().string().match(/^\d+$/)('4127'))
    assert(!createSuperValidator().string().match(/^\d+$/)('4127x'))
  })
})
