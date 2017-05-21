const PIXI = require('pixi.js')
const PixiParticles = require("pixi-particles");

class TankActor {
    constructor (renderer) {
        this.gameEngine = renderer.gameEngine
        this.backLayer = renderer.layer1
        this.sprite = new PIXI.Container()
        this.tankContainerSprite = new PIXI.Container()

        this.tankSprite = new PIXI.Sprite(PIXI.loader.resources.tank.texture)

        this.sprite.actor = this

        this.tankSprite.anchor.set(0.5, 0.5)
        this.tankSprite.width = 128
        this.tankSprite.length = 187

        this.sprite.addChild(this.tankContainerSprite)
        this.tankContainerSprite.addChild(this.tankSprite)
    }


    renderStep (delta) {

    }


    destroy(){
        return new Promise((resolve) =>{
            this.tankSprite.destroy();

            this.tankContainerSprite.destroy();
        });
    }
}

module.exports = TankActor
