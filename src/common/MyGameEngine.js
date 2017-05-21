'use strict';

const GameEngine = require('lance-gg').GameEngine;
const math = require('math.js')
const TwoVector = require('lance-gg').serialize.TwoVector
const Tank = require('./Tank')
const Bullet = require('./Bullet.js')
// const Timer = require('./Timer.js')

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {

        super.start();

        this.worldSettings = {
            worldWrap : true,
            width: 3000,
            height: 3000
        }

        this.on('collisionStart', (e) => {
            let collisionObjects = Object.keys(e).map(k => e[k])
            let tank = collisionObjects.find(o => o.class === Tank)
            let bullet = collisionObjects.find(o => o.class === Bullet)

            if (!tank|| !bullet)
                return;

            if (bullet.ownerId !== tank.id) {
                this.trace.info(`bullet by ship=${bullet.ownerId} hit ship=${bullet.id}`)
                this.emit('bulletHit', { bullet, tank})
                this.destroyBullet(bullet.id)
            }
        })
    }

    makeBullet(playerTank, inputId) {
        let color = playerTank.color
        console.log(`color : ${color}`)
        let bullet = new Bullet(++this.world.idCount, color)
        let speed = bullet.speed
        bullet.position.copy(playerTank.position)
        bullet.velocity.copy(playerTank.velocity)
        bullet.angle = playerTank.angle
        bullet.playerId = playerTank.playerId
        bullet.ownerId = playerTank.id
        bullet.inputId = inputId
        // bullet.velocity.x += Math.cos(bullet.angle * (Math.PI / 180)) * 10
        // bullet.velocity.y += Math.sin(bullet.angle * (Math.PI / 180)) * 10

        let fx = speed * math.cos( bullet.angle)
        let fy = speed * math.sin( bullet.angle)

        bullet.velocity = new TwoVector(fx, fy)

        this.trace.trace(`bullet[${bullet.id}] created vel=${bullet.velocity}`)

        let obj = this.addObjectToWorld(bullet)

        if (obj)
            setTimeout(() => {
                this.destroyBullet(bullet.id)
            }, 2000)

        return bullet
    }

    destroyBullet(bulletId) {
        if (this.world.objects[bulletId]) {
            this.trace.trace(`missiel${bulletId} destroyed`)
            this.removeObjectFromWorld(bulletId)
        }
    }

    addTank(playerId) {
        let tank = new Tank(++this.world.idCount, 0, new TwoVector(0, 0))

        tank.playerId = playerId
        this.addObjectToWorld(tank)

        this.tanks[playerId] = tank

        return tank
    }

    removeTank(playerId) {
        try {
            this.removeObjectFromWorld(this.tanks[playerId].id)
        }

        catch(e) {
            console.log(`failed to remove tank: ${playerId}`)
        }
    }

    initGame() {
        this.tanks = {}
    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/Tank'))
        serializer.registerClass(require('../common/Bullet'))
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.getPlayerObject(playerId);

        if (!player)
            return

        let input = inputData.input

        let x = player.speed * math.cos(player.angle)
        let y = player.speed * math.sin(player.angle)

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

        case 'shoot':
            this.makeBullet(player, inputData.messageIndex)
            break
        }

    }
}

module.exports = MyGameEngine;
