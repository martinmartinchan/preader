const Preader = require('../src/preader')
const Promise = require('bluebird')
const should = require('chai').should()

describe('Preader', () => {
  describe('of', () => {
    it('of', () => {
      const wrappedValue = Preader.of(37)
      wrappedValue.run({})
        .then(result => result.should.be.equal(37))
    })
  })

  describe('ask and run', () => {
    const add37Real = number => number + 37
    const add37Fake = number => number
    
    it('real add', () => {
      const env = { add37: add37Real }
      const wrappedValue = Preader.ask.map(({ add37 }) => {
        return add37(0)
      })
      wrappedValue.run(env)
      .then(result => result.should.be.equal(37))
    })

    it('fake add', () => {
      const env = { add37: add37Fake }
      const wrappedValue = Preader.ask.map(({ add37 }) => {
        return add37(0)
      })
      wrappedValue.run(env)
        .then(result => result.should.be.equal(0))
    })
  })

  describe('lift', () => {
    const wrappedValue = Preader.lift(Promise.resolve(37))
    wrappedValue.run({})
        .then(result => result.should.be.equal(37))
  })

  describe('map and chain', () => {
    const firstValue = Preader.of(0)
    const secondValue = Preader.of(37)
    it('map and chain', () => {
      const wrappedValue = firstValue
      .chain(() => secondValue)
      .map(value => `The last value is ${value}`)
      wrappedValue.run({})
        .then(result => result.should.be.equal('The last value is 37'))
    })
  })

  describe('props', () => {
    const testObject = {
      key1: Preader.of(18),
      key2: Preader.of(19)
    }
    it('props', () => {
      const wrappedValue = Preader.props(testObject)
        .map(({key1, key2}) => key1 + key2)
        .run({})
        .then(result => result.should.be.equal(37))
    })
  })
})

