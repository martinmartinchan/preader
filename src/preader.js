const Promise = require('bluebird')

function transform (P) {
  class ReaderT {
    constructor (f) {
      this.f = f
    }

    run (env) {
      return this.f(env)
    }

    map (g) {
      const reader = this
      return new ReaderT(e =>
        this.run(e).then(a => g(a)))
    }

    chain (g) {
      const reader = this
      return new ReaderT(e =>
        this.run(e).then(a => g(a).run(e)))
    }
  }

  ReaderT.of = (a) => new ReaderT(e => P.resolve(a))

  ReaderT.ask = new ReaderT(e => P.resolve(e))

  ReaderT.lift = (m) => new ReaderT(b => m)

  ReaderT.props = (obj) => new ReaderT(e => {
    return Promise.props(Object.entries(obj).reduce((acc, keyValue) => {
      acc[keyValue[0]] = keyValue[1].run(e)
      return acc
    }, {}))
  })

  return ReaderT
}

const Preader = transform(Promise)

module.exports = Preader