'use strict';

const ServerEngine = require('lance-gg').ServerEngine;

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame()

        this.players = {}

        this.gameEngine.on('bulletHit', (e) => {
            // add kills
            // if (this.scoreData[e.missile.ownerId]) this.scoreData[e.missile.ownerId].kills++;
            // // remove score data for killed ship
            // delete this.scoreData[e.ship.id];
            // this.updateScore();

            console.log(`tank killed: ${e.tank.toString()}`);
            try {
                this.gameEngine.removeObjectFromWorld(e.tank.id);
            }

            catch (e) {
                console.log(`failed to kill tank : ${e.tank.id}`)
            }
            // if (e.ship.isBot) {
            //     setTimeout(() => this.makeBot(), 5000);
            // }
        });
    }
    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        // this.players[socket.playerId] = socket.playerId

        // this.gameEngine.addTank(socket.playerId)

        let makePlayerTank = () => {
            let tank = this.gameEngine.addTank(socket.playerId)
        }

        socket.on('requestRestart', makePlayerTank)
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removeTank(playerId)
        this.players[playerId] = null
    }
}

module.exports = MyServerEngine;
