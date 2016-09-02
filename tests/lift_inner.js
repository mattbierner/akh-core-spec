"use strict"
const assert = require('chai').assert
const StateT = require('akh.state').StateT
const Identity = require('akh.Identity').Identity
const spec = require('../index')


const run = c =>
    Identity.run(
        StateT.eval(
            StateT.eval(
                StateT.eval(
                    StateT.eval(c, 1),
                    2),
                3),
            4))

const M = StateT(StateT(StateT(StateT(Identity))))



describe('Lift Inner', () => {
    it("top_level", () => {
        const c = M.get

        assert.strictEqual(1, run(c))
    })

    it("liftOne", () => {
        const c = M.lift(M.inner.get)

        assert.strictEqual(2, run(c))
    })

    it("liftInner", () => {
        const c = M.liftInner(M.inner.inner.get)

        assert.strictEqual(3, run(c))
    })

    it("liftInner2", () => {
        const c = M.liftInner.liftInner(M.inner.inner.inner.get)

        assert.strictEqual(4, run(c))
    })
})
