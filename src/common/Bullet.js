'use strict'

const Serializer = require('lance-gg').serialize.Serializer
const DynamicObject = require('lance-gg').serialize.DynamicObject

class Bullet extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            inputId: { type: Serializer.TYPES.INT32 },
            ownerId: { type: Serializer.TYPES.INT32 },
            speed: { type: Serializer.TYPES.FLOAT32},
            color: {type: Serializer.TYPES.FLOAT32}
        }, super.netScheme);
    }


    toString() {
        return `Bullet::${super.toString()}`;
    }

    syncTo (other) {
        super.syncTo(other)

        this.inputId = other.inputId
        this.ownerId = other.ownerId
        this.speed = other.speed
        this.color = other.color
    }

    constructor (id,color) {
        super (id)

        this.color = color
        this.speed = 10
        this.class = Bullet
    }

}

module.exports = Bullet
