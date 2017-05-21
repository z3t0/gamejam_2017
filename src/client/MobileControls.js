const EventEmitter = require('eventemitter3');
const Utils = require('../common/Utils');

/**
 * This class handles touch device controls
 */
class MobileControls{

    constructor(renderer){
        Object.assign(this, EventEmitter.prototype);
        this.renderer = renderer;

        this.touchContainer = document.querySelector(".pixiContainer");
        this.setupListeners();

        this.activeInput = {
            up: false,
            left: false,
            right: false
        };

        let onRequestAnimationFrame = () => {
            this.handleMovementInput();
            window.requestAnimationFrame(onRequestAnimationFrame);
        };

        onRequestAnimationFrame();

    }

    setupListeners(){
        let touchHandler = (e) => {
            // If there's exactly one finger inside this element
            let touch = e.targetTouches[0];
            this.currentTouch = {
                x: touch.pageX,
                y: touch.pageY
            };

            if (e.type === 'touchstart' && e.targetTouches[1]){
                this.emit('fire');
            }
        };

        this.touchContainer.addEventListener('touchstart', touchHandler, false);
        this.touchContainer.addEventListener('touchmove', (e) =>{
            touchHandler(e);
            // if ingame prevent scrolling
            if (this.renderer.playerTank) {
                e.preventDefault();
            }
        }, false);

        this.touchContainer.addEventListener('touchend', (e) => {
            this.currentTouch = false;
            this.activeInput.up = false;
            this.activeInput.left = false;
            this.activeInput.right = false;
            this.renderer.onKeyChange({ keyName: 'up', isDown: false });
        }, false);

        document.querySelector('.fireButton').addEventListener('click', () => {
            this.emit('fire');
        });
    }

    handleMovementInput(){
        // no touch, no movement
        if (!this.currentTouch) return;

        // by default no touch
        this.activeInput.right = false;
        this.activeInput.left = false;
        this.activeInput.up = false;

        let playerTank = this.renderer.playerTank;
        // no player tank, no movement
        if (!playerTank) return;

        let playerTankeScreenCoords = this.renderer.gameCoordsToScreen(playerTank);

        let dx = this.currentTouch.x - playerTankScreenCoords.x;
        let dy = this.currentTouch.y - playerTankScreenCoords.y;
        let shortestArc = Utils.shortestArc(Math.atan2(dx, -dy),
            Math.atan2(Math.sin(playerTank.actor.tankContainerSprite.rotation + Math.PI / 2), Math.cos(playerTank.actor.playerTankContainerSprite.rotation + Math.PI / 2)));

        let rotateThreshold = 0.3;
        let distanceThreshold = 120;

        // turn left or right
        if (shortestArc > rotateThreshold){
            this.activeInput.left = true;
            this.activeInput.right = false;
        } else if (shortestArc < -rotateThreshold) {
            this.activeInput.right = true;
            this.activeInput.left = false;
        }

        // don't turn if too close
        if (Math.sqrt(dx * dx + dy * dy) > distanceThreshold) {
            this.activeInput.up = true;
            this.renderer.onKeyChange({ keyName: 'up', isDown: true });
        } else {
            this.renderer.onKeyChange({ keyName: 'up', isDown: false });
        }

    }

}

module.exports = MobileControls;
