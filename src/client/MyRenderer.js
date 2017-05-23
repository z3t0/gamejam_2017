'use strict';

const Renderer = require('lance-gg').render.Renderer;
const PIXI = require('pixi.js')
const Tank = require('../common/Tank.js')
const TankActor = require('./TankActor.js')
const Bullet = require('../common/Bullet.js')

class MyRenderer extends Renderer {

    get ASSETPATHS(){
        return {
            tank: 'res/img/tank1.png',
            bullet: 'res/img/bullet.png',
            background: 'res/img/map.png'

        }
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};

        this.assetPathPrefix = this.gameEngine.options.assetPathPrefix?this.gameEngine.options.assetPathPrefix:'';

    }

    init() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.stage = new PIXI.Container();
        this.layer1 = new PIXI.Container();
        this.layer2 = new PIXI.Container();

        this.stage.addChild(this.layer1, this.layer2);

        // Load textures
        return new Promise((resolve, reject)=>{
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x)=>{
                return{
                    name: x,
                    url: this.assetPathPrefix + this.ASSETPATHS[x]
                };
            }))
                .on('progress', loadProgressHandler)
                .load(() => {
                    this.isReady = true;
                    this.setupStage();
                    this.gameEngine.emit('renderer.ready');
                    resolve();
                })
        })
    }

    setupStage() {
        var renderer = PIXI.autoDetectRenderer(256, 256)

        // Add the canvas to the HTML document

        // Autoresize
        renderer.view.style.position = 'absolute'
        renderer.view.style.display = 'block'
        renderer.autoResize = true
        renderer.resize(window.innerWidth, window.innerHeight)

        this.renderer = renderer

        this.lookingAt = { x: 0, y: 0 };
        this.camera = new PIXI.Container();
        this.camera.addChild(this.layer1, this.layer2);

        // var background =  new PIXI.Sprite(PIXI.loader.resources.background.texture)
        // this.stage.addChild(background)

        this.stage.addChild(this.camera);

        document.getElementById('pixiContainer').appendChild(renderer.view)
    }

    draw() {
        super.draw();

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId];
            let sprite = this.sprites[objId];

            if (objData)  {
                if (objData.class == Tank) {
                    sprite.x = objData.position.x
                    sprite.y = objData.position.y
                    sprite.rotation = objData.angle
                } else if (objData.class == Bullet) {
                    sprite.x = objData.x
                    sprite.y = objData.y
                    sprite.rotation = objData.angle

                    sprite.anchor.set(0.5, 0.5);
                }
            }
        }

        this.renderer.render(this.stage)
    }

    addObject(obj, opts) {
        let sprite;

        // if new tank
        if (obj.class == Tank) {
            let tankActor = new TankActor(this, obj)
            sprite = tankActor.sprite
            this.sprites[obj.id] = sprite
            sprite.id = obj.id

            if (this.clientEngine.isOwnedByPlayer(obj)) {
                // if me
                this.playerTank = sprite

                document.querySelector('#tryAgain').disabled = true;
                document.querySelector('#joinGame').disabled = true;
                document.querySelector('#joinGame').style.opacity = 0;

                this.gameStarted = true; // todo state shouldn't be saved in the renderer
            }

            this.layer1.addChild(sprite)
        } else if (obj.class == Bullet) {
            sprite = new PIXI.Sprite(PIXI.loader.resources.bullet.texture)
            sprite.tint = obj.color
            sprite.scale.x = 0.04
            sprite.scale.y = 0.04
            this.sprites[obj.id] = sprite
            sprite.id = obj.id
            this.layer1.addChild(sprite)
        }

    }

    removeObject(obj) {
        if (this.playerTank && obj.id == this.playerTank.id) {
            this.playerTank = null
        }

        if (obj.class == Tank && this.playerTank && obj.id != this.playerTank.id) {
            // remove tank
        }

        let sprite = this.sprites[obj.id]

        if (sprite.actor) {
            sprite.actor.destroy().then(() => {
                console.log('deleted sprite')
                delete this.sprites[obj.id]
            })
        } else {
            console.log('destroy object bullet')
            this.sprites[obj.id].destroy()
            delete this.sprites[obj.id]
        }
    }

    onKeyChange(key) {
        console.log(`renderer got ${key}`)
    }

}

function loadProgressHandler (loader, resource) {
    // Display the file `url` currently being loaded
    console.log('loading: ' + resource.url)

    // Display the precentage of files currently loaded
    console.log('progress: ' + loader.progress + '%')

    // If you gave your files names as the first argument
    // of the `add` method, you can access them like this
    // console.log("loading: " + resource.name);
}

module.exports = MyRenderer;
