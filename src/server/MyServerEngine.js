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
    }
    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.players[socket.playerId] = socket.playerId

        this.gameEngine.addTank(socket.playerId)

    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.gameEngine.removeTank(playerId)
        this.players[playerId] = null
    }
}

module.exports = MyServerEngine;
