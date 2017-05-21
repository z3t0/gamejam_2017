const EventEmitter = require('eventemitter3');
const Keyboard = require('keyboardjs')

class Input {
    constructor(renderer){
        Object.assign(this, EventEmitter.prototype);
        this.renderer = renderer;


        this.setupListeners();

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
            shoot: false,
            shootRelease: false
        };
    }

    setupListeners() {
        Keyboard.bind('a', () => {
            this.onKeyChange('left')
        })

        Keyboard.bind('a', null, () => {
            this.onKeyChange('left-release')
        })

        Keyboard.bind('s', () => {
            this.onKeyChange('down')
        })

        Keyboard.bind('s', null, () => {
            this.onKeyChange('down-release')
        })

        Keyboard.bind('d', () => {
            this.onKeyChange('right')
        })

        Keyboard.bind('d', null, () => {
            this.onKeyChange('right-release')
        })

        Keyboard.bind('w', () => {
            this.onKeyChange('up')
        })

        Keyboard.bind('w', null, () => {
            this.onKeyChange('up-release')
        })

        Keyboard.bind('space', () => {
            this.onKeyChange('shoot')
        })

        Keyboard.bind('w', null, () => {
            this.onKeyChange('shoot-release')
        })
    }

    onKeyChange(key) {
        switch(key) {
        case 'up':
            this.pressedKeys.upRelease = false
            this.pressedKeys.up = true
            break

        case 'up-release':
            this.pressedKeys.upRelease = true
            this.pressedKeys.up = false
            break

        case 'down':
            this.pressedKeys.down = true
            this.pressedKeys.downRelease = false
            break

        case 'down-release':
            this.pressedKeys.down = false
            this.pressedKeys.downRelease = true
            break

        case 'left':
            this.pressedKeys.left = true
            this.pressedKeys.downRelease = false
            break

        case 'left-release':
            this.pressedKeys.leftRelease= true
            this.pressedKeys.left = false
            break

        case 'right':
            this.pressedKeys.right = true
            this.pressedKeys.rightRelease =false
            break

        case 'right-release':
            this.pressedKeys.right =false
            this.pressedKeys.rightRelease = true
            break

        case 'shoot':
            if (!this.pressedKeys.shoot)
                this.emit('shoot')
            break

        case 'shoot-release':
            break

        default:
            return
        }

        this.renderer.onKeyChange({ key })
    }
}

module.exports = Input
