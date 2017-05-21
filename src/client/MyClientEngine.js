const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/MyRenderer');
const Tank = require('../common/Tank')
const Input = require('./Input.js')
const howler = require('howler')

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.gameEngine.on('client__preStep', this.preStep.bind(this));
    }

    start () {
        super.start()

        this.gameEngine.on('objectDestroyed', (obj) => {
            if (obj.class == Tank && this.isOwnedByPlayer(obj)) {
                console.log('try again')
                document.querySelector('#tryAgain').disabled = false;
                var el = document.getElementById('tryAgain')
                el.style.pointerEvents = 'all'
                el.style.opacity = 1
            }
        });

        this.gameEngine.once('renderer.ready', () => {
            this.input = new Input(this.renderer)

            // Sounds
            this.sounds = {}
            this.sounds.move = new Howl({
                  src: ['res/sound/moving.mp3']
                })

            this.sounds.fire = new Howl({
                  src: ['res/sound/fire.mp3']
                })

            this.sounds.bomb = new Howl({
                  src: ['res/sound/bomb.mp3']
                })

            this.sounds.backgroundmusic = new Howl({
                  src: ['res/sound/backgroundmusic.mp3']
                })
            // this.sounds.bulletFire = new Howl()

            this.sounds.backgroundmusic.play()

            console.log('renderer ready')

            document.querySelector('#joinGame').addEventListener('click', () => {
                this.socket.emit('requestRestart');
            });

            document.querySelector('#tryAgain').addEventListener('click', () => {
                this.socket.emit('requestRestart');
                document.querySelector('#tryAgain').disabled = true;
                var el = document.getElementById('tryAgain')
                el.style.pointerEvents = 'none'
                el.style.opacity = 0
            });

            this.input.on('shoot', () => {
                this.sendInput('shoot')
                this.sounds.fire.play()
            })


            this.gameEngine.on('bulletHit', () => {
                if (this.renderer.playerTank) {
                    this.sounds.bomb.play()
                    // play sound
                }
            })
        })

    }


    // our pre-step is to process all inputs
    preStep() {
        if (!this.input)
            return

        if (this.input.pressedKeys.up) {
            this.sendInput('up', { movement: true });
            this.input.pressedKeys.up = false
            this.sounds.move.play()
        }

        else if (this.input.pressedKeys.upRelease) {
            this.sendInput('up-release', { movement: true})
            this.input.pressedKeys.upRelease = false
            this.sounds.move.stop()
        }

        if (this.input.pressedKeys.down) {
            this.sendInput('down', { movement: true });
            this.input.pressedKeys.down = false
            this.sounds.move.play()
        }

        else if (this.input.pressedKeys.downRelease) {
            this.sendInput('down-release', { movement: true})
            this.input.pressedKeys.downRelease = false
            this.sounds.move.stop()
        }

        if (this.input.pressedKeys.left) {
            this.sendInput('left', { movement: true });
            this.input.pressedKeys.left = false
            this.sounds.move.play()

        }

        else if (this.input.pressedKeys.leftRelease) {
            this.sendInput('left-release', { movement: true})
            this.input.pressedKeys.leftRelease = false
            this.sounds.move.stop()
        }

        if (this.input.pressedKeys.right) {
            this.sendInput('right', { movement: true });
            this.input.pressedKeys.right = false
            this.sounds.move.play()
        }

        else if (this.input.pressedKeys.rightRelease) {
            this.sendInput('right-release', { movement: true})
            this.input.pressedKeys.rightRelease = false
            this.sounds.move.stop()
        }
    }

}
module.exports = MyClientEngine;
