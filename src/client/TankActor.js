const PIXI = require('pixi.js')
const PixiParticles = require("pixi-particles");
const ThrusterEmitterConfig = require("./ThrusterEmitter.json");
const ExplosionEmitterConfig = require("./ExplosionEmitter.json");

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

        this.addThrustEmitter();
    }


    renderStep (delta) {
        if (this.thrustEmitter) {
            this.thrustEmitter.update(delta * 0.001);

            this.thrustEmitter.spawnPos.x = this.sprite.x - Math.cos(-this.tankContainerSprite.rotation) * 4;
            this.thrustEmitter.spawnPos.y = this.sprite.y + Math.sin(-this.tankContainerSprite.rotation) * 4;

            this.thrustEmitter.minStartRotation = this.tankContainerSprite.rotation * 180 / Math.PI + 180 - 1;
            this.thrustEmitter.maxStartRotation = this.tankContainerSprite.rotation * 180 / Math.PI + 180 + 1;
        }
        if (this.explosionEmitter){
            this.explosionEmitter.update(delta * 0.001);
        }
    }

    addThrustEmitter(){
        this.thrustEmitter = new PIXI.particles.Emitter(
            this.backLayer,
            [PIXI.loader.resources.smokeParticle.texture],
            ThrusterEmitterConfig
        );
        this.thrustEmitter.emit = false;

        this.explosionEmitter = new PIXI.particles.Emitter(
            this.shipContainerSprite,
            [PIXI.loader.resources.smokeParticle.texture],
            ExplosionEmitterConfig
        );

        this.explosionEmitter.emit = false;
    }

    destroy(){
        return new Promise((resolve) =>{
            // this.explosionEmitter.emit = true;

            // if (this.nameText)
            //     this.nameText.destroy();
            // this.thrustEmitter.destroy();
            // this.thrustEmitter = null;
            this.tankSprite.destroy();

            setTimeout(()=>{
                this.tankContainerSprite.destroy();
                // this.explosionEmitter.destroy();
                resolve();
            },3000);
        });
    }
}

module.exports = TankActor
