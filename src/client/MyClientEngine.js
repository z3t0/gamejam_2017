const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/MyRenderer');
const KeyboardControls = require('../client/KeyboardControls');
const MobileControls = require('../client/MobileControls');
const Tank = require('../common/Tank')
const Utils = require('../common/Utils')

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.gameEngine.on('client__preStep', this.preStep.bind(this));
    }

    start() {
        super.start()

        this.gameEngine.on('objectDestroyed', (obj) => {
            if (obj.class == Tank && this.isOwnedByPlayer(obj)) {
                document.body.classList.add('lostGame');
                document.querySelector('#tryAgain').disabled = false;
            }
        });

        this.gameEngine.once('renderer.ready', () => {
            // click event for "try again" button
            document.querySelector('#tryAgain').addEventListener('click', () => {
                if (Utils.isTouchDevice()){
                    this.renderer.enableFullScreen();
                }
                this.socket.emit('requestRestart');
            });

            document.querySelector('#joinGame').addEventListener('click', () => {
                if (Utils.isTouchDevice()){
                    this.renderer.enableFullScreen();
                }
                this.socket.emit('requestRestart');
            });

            document.querySelector('#reconnect').addEventListener('click', () => {
                window.location.reload();
            });

            if (Utils.isTouchDevice()){
                this.controls = new MobileControls(this.renderer);
            } else {
                this.controls = new KeyboardControls(this.renderer);
            }

            this.controls.on('fire', () => {
                this.sendInput('space');
            });
        })
     }

        preStep() {
            if (this.controls) {
                if (this.controls.activeInput.up) {
                    this.sendInput('up', { movement: true });
                }

                if (this.controls.activeInput.left) {
                    this.sendInput('left', { movement: true });
                }

                if (this.controls.activeInput.right) {
                    this.sendInput('right', { movement: true });
                }
            }
        }
    }

    module.exports = MyClientEngine;
