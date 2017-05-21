const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/MyRenderer');
const Tank = require('../common/Tank')
const Keyboard = require('keyboardjs')

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.gameEngine.on('client__preStep', this.preStep.bind(this));

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            downRelease: false,
            up: false,
            upRelease: false,
            left: false,
            leftRelease: false,
            right: false,
            rightRelease: false,
            space: false,
            spaceRelease: false
        };

        let that = this;

        Keyboard.bind('a', () => {
            this.pressedKeys.left = true
            this.pressedKeys.downRelease = false
        })

        Keyboard.bind('a', null, () => {
            this.pressedKeys.leftRelease= true
            this.pressedKeys.left = false
        })

        Keyboard.bind('s', () => {
            this.pressedKeys.down = true
            this.pressedKeys.downRelease = false
        })

        Keyboard.bind('s', null, () => {
            this.pressedKeys.down = false
            this.pressedKeys.downRelease = true
        })

        Keyboard.bind('d', () => {
            this.pressedKeys.right = true
            this.pressedKeys.rightRelease =false
        })

        Keyboard.bind('d', null, () => {
            this.pressedKeys.right =false
            this.pressedKeys.rightRelease = true
        })

        Keyboard.bind('w', () => {
            this.pressedKeys.upRelease = false
            this.pressedKeys.up = true
        })

        Keyboard.bind('w', null, () => {
            this.pressedKeys.upRelease = true
            this.pressedKeys.up = false
        })
    }

    // our pre-step is to process all inputs
    preStep() {


        if (this.pressedKeys.up) {
            this.sendInput('up', { movement: true });
            this.pressedKeys.up = false
        }

        else if (this.pressedKeys.upRelease) {
            this.sendInput('up-release', { movement: true})
            this.pressedKeys.upRelease = false
        }

        if (this.pressedKeys.down) {
            this.sendInput('down', { movement: true });
            this.pressedKeys.down = false
        }

        else if (this.pressedKeys.downRelease) {
            this.sendInput('down-release', { movement: true})
            this.pressedKeys.downRelease = false
        }

        if (this.pressedKeys.left) {
            this.sendInput('left', { movement: true });
            this.pressedKeys.left = false
        }

        else if (this.pressedKeys.leftRelease) {
            this.sendInput('left-release', { movement: true})
            this.pressedKeys.leftRelease = false
        }

        if (this.pressedKeys.right) {
            this.sendInput('right', { movement: true });
            this.pressedKeys.right = false
        }

        else if (this.pressedKeys.rightRelease) {
            this.sendInput('right-release', { movement: true})
            this.pressedKeys.rightRelease= false
        }

        if (this.pressedKeys.space) {
            this.sendInput('space', { movement: true });
            this.pressedKeys.space = false
        }

        else if (this.pressedKeys.spaceRelease) {
            this.sendInput('space-release', { movement: true})
            this.pressedKeys.spaceRelease= false
        }
    }

}
module.exports = MyClientEngine;
