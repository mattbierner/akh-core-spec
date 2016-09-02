/**
 * Fantasy land structure definitions
 */
"use strict"
const base = require('akh.core')

const bind = (f, x) => f.bind(null, x)

/**
 * Define applicative functor of `Instance`.
 */
const Applicative = module.exports.Applicative = (Instance, of, ap) => {
    Instance.of = Instance.prototype.of = of
    
    Instance.ap = base.ap
    Instance.prototype.ap = ap
    
    // Derived
    Functor(Instance,
        Instance.prototype.map || function(f) {
            return of(f).ap(this)
        })
    
    Instance.ac = base.liftA2.bind(null, bind)
    Instance.prototype.ac = function(m) { return base.liftA2(bind, this, m) }
    
    return Instance
}

/**
 * Define chainable of `Instance`.
 */
const Chain = module.exports.Chain = (Instance, chain) => {
    Instance.chain = base.chain
    Instance.prototype.chain = chain
    
    return Instance
}

/**
 * Define functor of `Instance`.
 */
const Functor = module.exports.Functor = (Instance, map) => {
    Instance.map = base.map
    Instance.prototype.map = map
    
    return Instance
}

/**
 * Define monoid of `Instance`.
 */
const Monoid = module.exports.Monoid = (Instance, zero, plus) => {
    Instance.zero = Instance.prototype.zero = zero
    
    Semigroup(Instance,
        plus)
    
    return Instance
}

/**
 * Define monad of `Instance`.
 */
const Monad = module.exports.Monad = (Instance, of, chain) => {
    Instance.of = Instance.prototype.of = of
    
    Chain(Instance,
        chain)
    
    // Derived
    Functor(Instance,
        Instance.prototype.map || function(f) {
            return this.chain(x => this.of(f(x)))
        })
    
    Applicative(Instance,
        of,
        Instance.prototype.ap || function(m) {
            return this.chain(f => m.map(f))
        })

    return Instance
}

/**
 * Define semigroup of `Instance`.
 */
const Semigroup = module.exports.Semigroup = (Instance, plus) => {
    Instance.concat = base.concat
    Instance.prototype.concat = plus
    
    return Instance
}


var liftInner = (lift, outer, inner) => {
    if (inner.liftInner) {
        var y = inner.liftInner
        outer.liftInner = liftInner(lift, z => lift(y(z)), inner.liftInner)
    }
    return outer
}

const LiftInner = module.exports.LiftInner = (Instance, m, lift) => {
    if (m.lift) {
        var y = m.lift
        Instance.prototype.liftInner = liftInner(lift, z => lift(y(z)), m)
        Instance.liftInner = Instance.prototype.liftInner
    }
    return Instance
}

/**
 * Define monad transformer of `Instance`.
 */
const Transformer = module.exports.Transformer = (Instance, m, lift) => {
    Instance.inner = Instance.prototype.inner = m

    Instance.lift = Instance.prototype.lift = lift

    // Derived
    LiftInner(Instance, m, lift)

    return Instance
}

