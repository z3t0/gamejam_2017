'use strict'

const DynamicObject = require('lance-gg').serialize.DynamicObject
const Serializer = require('lance-gg').serialize.Serializer;
const TwoVector = require('lance-gg').serialize.TwoVector
const color = require('random-hex')

class Tank extends DynamicObject {

    get bendingMultiple() { return 0.8; }
    get velocityBendingMultiple() { return 0; }

    static get netScheme() {
        return Object.assign({
            speed : { type: Serializer.TYPES.FLOAT32 },
            color: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }


    toString() {
        return `${'Player'}::Ship::${super.toString()}`;
    }

    syncTo(other) {
        super.syncTo(other)

        this.color = other.color
    }

    get bendingAngleLocalMultiple() { return 0.5; }

    constructor (id, gameEngine, pos) {
        super(id, pos)

        this.gameEngine = gameEngine
        // this.velocity = new TwoVector(1, 0)
        this.angle = 0
        this.class = Tank
        this.speed = 5
        var c = color.generate()
        c = c.substring(1, c.length)
        this.color = parseInt(c, 16)
        this.rotationSpeed = 0.2
    }
}

module.exports = Tank
