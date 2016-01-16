import assert from 'assert'
import isObject from 'lodash/isObject'
import * as v from '../lib/Validators'
import validate from '../lib/validate'
import createSuperValidator from '../lib/createSuperValidator'

describe('validate()', () => {
  const shape = {
    a: v.number(),
    b: v.boolean(),

    c: v.shape({
      a: v.number(),
      b: v.boolean()
    }),

    d: v.items({
      a: v.number(),
      b: v.boolean()
    })
  }

  it('will accept a validator', () => {
    validate(v.number(), 2)
  })

  it('will return an object', () => {
    assert(isObject(validate(v.number(), 2)))
  })

  it('has a strict method', () =>
    assert.throws(() => validate.strict(v.string(), 2), /wrong type/i)
  )

  it('will return an object with a success property', () => {
    assert.equal(validate(v.number(), 2).success, true)
    assert.equal(validate(v.number(), true).success, false)
  })

  it('will use a shape validator', () => {
    assert.equal(validate(shape, { a: 2, b: false, c: { a: 3, b: true }, d: [] }).success, true)
    assert.equal(validate(shape, { a: true, b: 4 }).success, false)
  })

  it('can be curried', () => {
    assert.equal(validate(v.number())(2).success, true)
    assert.equal(validate(v.number())(true).success, false)
  })

  it('will return an object of errors', () => {
    assert.deepEqual(validate(v.number(), 2), {
      success: true,
      details: []
    })

    assert.deepEqual(validate(v.number(), true), {
      success: false,
      details: [
        {
          path: '/',
          value: true,
          errors: ['number']
        }
      ]
    })

    const value = {
      a: true,
      b: 4,
      c: { a: false, b: 8 },
      d: [
        { a: true, b: 200 },
        { a: false, b: 100 },
        { a: 4, b: true },
        { a: false, b: true }
      ]
    }

    assert.deepEqual(validate(shape, value), {
      success: false,
      details: [{
        path: '/a',
        value: true,
        errors: ['number']
      }, {
        path: '/b',
        value: 4,
        errors: ['boolean']
      }, {
        path: '/c',
        value: { a: false, b: 8 },
        errors: ['shape']
      }, {
        path: '/c/a',
        value: false,
        errors: ['number']
      }, {
        path: '/c/b',
        value: 8,
        errors: ['boolean']
      }, {
        path: '/d',
        value: value.d,
        errors: ['items']
      }, {
        path: '/d/0/a',
        value: true,
        errors: ['number']
      }, {
        path: '/d/0/b',
        value: 200,
        errors: ['boolean']
      }, {
        path: '/d/1/a',
        value: false,
        errors: ['number']
      }, {
        path: '/d/1/b',
        value: 100,
        errors: ['boolean']
      }, {
        path: '/d/3/a',
        value: false,
        errors: ['number']
      }]
    })
  })

  it('will return multiple errors', () => {
    assert.deepEqual(validate(createSuperValidator().string().enum([2]).enum([3]), 5), {
      success: false,
      details: [{
        path: '/',
        value: 5,
        errors: ['string', 'enum', 'enum']
      }]
    })
  })
})
