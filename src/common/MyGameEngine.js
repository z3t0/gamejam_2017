'use strict';

const GameEngine = require('lance-gg').GameEngine;
const math = require('math.js')
const TwoVector = require('lance-gg').serialize.TwoVector
let Tank = require('./Tank')

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {

        super.start();

        this.on('objectAdded', (object) => {
            // debugger
            // if (object.id == 1) {
            //     this.tank1 = object
            // } else if(object.id == 2) {
            //     this.tank2 = object
            // }
        })
    }

    addTank(playerId) {
        let tank = new Tank(++this.world.idCount, 0, new TwoVector(0, 0))

        tank.playerId = playerId

        this.addObjectToWorld(tank)

        this.tanks[playerId] = tank
    }

    removeTank(playerId) {
        this.removeObjectFromWorld(this.tanks[playerId].id)
    }

    initGame() {
        this.tanks = {}
    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/Tank'))
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.getPlayerObject(playerId);

        let input = inputData.input

        let x = player.speed * math.cos(player.angle)
        let y = player.speed * math.sin(player.angle)

        console.log(input)

        switch(input) {
        case 'up':
            player.velocity = new TwoVector(x, y)
            break

        case 'up-release':
            player.velocity = new TwoVector(0, 0)
            break

        case 'down':
            player.velocity = new TwoVector(-x, -y)
            break

        case 'down-release':
            player.velocity = new TwoVector(0, 0)
            break

        case 'left':
            player.isRotatingLeft = true
            break

        case 'right':
            player.isRotatingRight = true
            break
        }
    }
}

module.exports = MyGameEngine;
