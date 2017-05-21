'use strict'

const DynamicObject = require('lance-gg').serialize.DynamicObject

class Tank extends DynamicObject {

    constructor (id, gameEngine, x, y) {
        super(id, x, y)

        this.gameEngine = gameEngine

        this.class = Tank
    }
}

module.exports = Tank
