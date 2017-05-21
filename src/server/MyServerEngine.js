'use strict';

const ServerEngine = require('lance-gg').ServerEngine;

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame()

        this.players = {
            player1: null
        }
    }
    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        if (this.players.player1 === null) {
            this.players.player1 = socket.id
            this.gameEngine.tank1.playerId = socket.playerId
        } else if (this.players.player2 === null) {
            this.players.player2 = socket.id
            this.gameEngine.tank2.playerId = socket.playerId
        }

    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        if (this.players.player1 == socketId) {
            console.log('Player 1 disconnected')
            this.players.player1 = null
        } else if (this.players.player == socketId) {
            console.log('Player 2 disconnected')
            this.players.player2 = null
        }
    }
}

module.exports = MyServerEngine;
