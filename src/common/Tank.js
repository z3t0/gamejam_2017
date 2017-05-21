'use strict'

const DynamicObject = require('lance-gg').serialize.DynamicObject
const Serializer = require('lance-gg').serialize.Serializer;
const TwoVector = require('lance-gg').serialize.TwoVector

class Tank extends DynamicObject {

    get bendingMultiple() { return 0.8; }
    get velocityBendingMultiple() { return 0; }

    static get netScheme() {
        return Object.assign({
            speed : { type: Serializer.TYPES.FLOAT32 }
        }, super.netScheme);
    }

    constructor (id, gameEngine, pos) {
        super(id, pos)

        this.gameEngine = gameEngine
        // this.velocity = new TwoVector(1, 0)
        this.angle = 0
        this.class = Tank
        this.speed = 5
        this.rotationSpeed = 0.4
    }
}

module.exports = Tank
