'use strict';

const GameEngine = require('lance-gg').GameEngine;
let Tank = require('./Tank')

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {

        super.start();

        this.on('objectAdded', (object) => {
            if (object.id == 1) {
                this.tank1 = object
            }
        })
    }

    initGame() {
        this.addObjectToWorld(new Tank(++this.world.idCount, 0, 0))
    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/Tank'))
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.getPlayerObject(playerId);

        if (inputData.input === 'up') {
            player.position.x += 5
        } else if (inputData.input === 'down') {
            player.position.x -= 5
        }
    }
}

module.exports = MyGameEngine;
