import assert from 'assert'
import * as v from '../src/Validators'

describe('Validators', () => {
  describe('any()', () => {
    it('will always be true', () => {
      assert(v.any()(true))
      assert(v.any()(5))
      assert(v.any()('asd'))
      assert(v.any()({ a: 1, b: 2 }))
      assert(v.any()([1, 2]))
      assert(v.any()(function () {}))
    })
  })

  describe('boolean()', () => {
    it('will only work for booleans', () => {
      assert(v.boolean()(true))
      assert(v.boolean()(false))
      assert(!v.boolean()(5))
      assert(!v.boolean()('asd'))
      assert(!v.boolean()({}))
      assert(!v.boolean()([]))
      assert(!v.boolean()(function () {}))
    })

    it('will work for nulls', () => {
      assert(v.boolean()())
      assert(v.boolean()(null))
    })
  })

  describe('number()', () => {
    it('will only work for numbers', () => {
      assert(v.number()(5))
      assert(v.number()(6))
      assert(!v.number()(true))
      assert(!v.number()('asd'))
      assert(!v.number()({}))
      assert(!v.number()([]))
      assert(!v.number()(function () {}))
    })

    it('will work for nulls', () => {
      assert(v.number()())
      assert(v.number()(null))
    })
  })

  describe('string()', () => {
    it('will work for strings', () => {
      assert(v.string()(''))
      assert(v.string()('asd'))
      assert(!v.string()(true))
      assert(!v.string()(2))
      assert(!v.string()({}))
      assert(!v.string()([]))
      assert(!v.string()(function () {}))
    })

    it('will work for nulls', () => {
      assert(v.string()())
      assert(v.string()(null))
    })
  })

  describe('object()', () => {
    it('will work for objects', () => {
      assert(v.object()({}))
      assert(!v.object()(true))
      assert(!v.object()(2))
      assert(!v.object()(function () {}))
    })

    it('will work for nulls', () => {
      assert(v.object()())
      assert(v.object()(null))
    })

    it('will not work for arrays', () => {
      assert(!v.object()([]))
    })
  })

  describe('array()', () => {
    it('will work for arrays', () => {
      assert(v.array()([]))
      assert(!v.array()(true))
      assert(!v.array()(2))
      assert(!v.array()({}))
      assert(!v.array()(function () {}))
    })

    it('will work for nulls', () => {
      assert(v.array()())
      assert(v.array()(null))
    })
  })

  describe('function()', () => {
    it('will only work for functions', () => {
      assert(v.function()(function () {}))
      assert(v.function()(() => true))
      assert(!v.function()(true))
      assert(!v.function()(5))
      assert(!v.function()('asd'))
      assert(!v.function()({}))
      assert(!v.function()([]))
    })

    it('will work for nulls', () => {
      assert(v.function()())
      assert(v.function()(null))
    })
  })

  describe('required()', () => {
    it('rejects falsey values', () => {
      assert(v.required()(true))
      assert(v.required()(false))
      assert(v.required()(5))
      assert(v.required()('asd'))
      assert(v.required()({ a: 1, b: 2 }))
      assert(v.required()([1, 2]))
      assert(v.required()(function () {}))
      assert(v.required()(NaN))
      assert(!v.required()())
      assert(!v.required()(null))
    })
  })

  describe('shape()', () => {
    it('will validate with a shape', () => {
      const shape = {
        a: v.number(),
        b: v.boolean()
      }
      assert(v.shape(shape)({ a: 1, b: false }))
      assert(!v.shape(shape)({ a: true, b: 2 }))
    })
  })

  describe('items()', () => {
    it('can be provided a validator', () => {
      assert(v.items(v.number())([1, 2, 3]))
      assert(!v.items(v.number())([1, 'asd', 3]))
    })

    it('can be provided a shape', () => {
      const shape = {
        a: v.number(),
        b: v.boolean()
      }
      assert(v.items(shape)([{ a: 1, b: false }, { a: 2, b: true }]))
      assert(!v.items(shape)([{ a: 1, b: false }, { a: 2, b: true }, { a: true, b: 2 }]))
    })
  })

  describe('match()', () => {
    it('will test using a regular expression', () => {
      assert(v.match(/^\d+$/)('2394'))
      assert(!v.match(/^\d+$/)('2394x'))
    })
  })

  describe('enum()', () => {
    it('requires value to be in the specified list', () => {
      const list = ['a', 'b', 3, false]
      assert(v.enum(list)('a'))
      assert(v.enum(list)(false))
      assert(v.enum(list)(3))
      assert(!v.enum(list)(true))
      assert(!v.enum(list)(4))
      assert(!v.enum(list)('c'))
    })
  })

  describe('instanceOf()', () => {
    it('uses the instanceof operator', () => {
      assert(v.instanceOf(Error)(new Error('Hello, world!')))
      assert(!v.instanceOf(Error)(new Map()))
      assert(!v.instanceOf(Error)({}))
      assert(!v.instanceOf(Error)([]))
      assert(!v.instanceOf(Error)(2))
    })
  })
})
