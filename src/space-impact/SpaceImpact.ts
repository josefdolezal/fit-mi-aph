// import { ParatrooperModel } from './ParatrooperModel';


import Component from '../../ts/engine/Component';
import DebugComponent from '../../ts/components/DebugComponent';
import Scene from '../../ts/engine/Scene';
import { PixiRunner } from '../../ts/PixiRunner'
import { PIXICmp } from '../../ts/engine/PIXIObject';
import SpaceImpactFactory from './factory/SpaceImpactFactory';
import {
    ATTR_FACTORY, SPRITES_RESOLUTION_HEIGHT, DATA_JSON, SCENE_HEIGHT,
} from './config/Constants';
import { Resources } from './config/Resources';


class SpaceImpact {
    engine: PixiRunner;

    // Start a new game
    constructor() {
        this.engine = new PixiRunner();

        let canvas = (document.getElementById("gameCanvas") as HTMLCanvasElement);

        let screenHeight = canvas.height;
        
        // calculate ratio between intended resolution (here 400px of height) and real resolution
        // - this will set appropriate scale 
        let gameScale = SPRITES_RESOLUTION_HEIGHT / screenHeight;
        // scale the scene to 50 units if height
        let resolution = screenHeight / SCENE_HEIGHT * gameScale;
        this.engine.init(canvas, resolution / gameScale);

        // set global scale which has to be applied for ALL sprites as it will
        // scale them to defined unit size
        SpaceImpactFactory.globalScale = 1 / resolution;

        // set resized width according to the current aspect ratio
        SpaceImpactFactory.screenWidth = SCENE_HEIGHT * (canvas.width / canvas.height);
        
        PIXI.loader
            .reset()    // necessary for hot reload
            .add(Resources.TEXTURE_TAG_SHIP, 'static/ship.png')
            .add(Resources.TEXTURE_TAG_MISSILE, 'static/missile.png')
            .add(Resources.TEXTURE_TAG_SIMPLE_ENEMY, 'static/simple_enemy.png')
            .add(Resources.TEXTURE_TAG_MOVING_ENEMY, 'static/moving_enemy.png')
            .add(Resources.TEXTURE_TAG_SHOOTING_ENEMY, 'static/shooting_enemy.png')
            // .add(TEXTURE_COPTER_LEFT, 'static/paratrooper/copter_left.png')
            // .add(TEXTURE_COPTER_RIGHT, 'static/paratrooper/copter_right.png')
            // .add(TEXTURE_PARATROOPER_PARACHUTE, 'static/paratrooper/paratrooper_parachute.png')
            // .add(TEXTURE_PARATROOPER, 'static/paratrooper/paratrooper.png')
            // .add(TEXTURE_PROJECTILE, 'static/paratrooper/projectile.png')
            // .add(TEXTURE_TOWER, 'static/paratrooper/tower.png')
            // .add(TEXTURE_TURRET, 'static/paratrooper/turret.png')
            // .add(SOUND_FIRE, 'static/paratrooper/fire.mp3')
            // .add(SOUND_GAMEOVER, 'static/paratrooper/gameover.mp3')
            // .add(SOUND_KILL, 'static/paratrooper/kill.mp3')
            // .add(DATA_JSON, 'static/paratrooper/config.json')
            .load(() => this.onAssetsLoaded());
    }

    onAssetsLoaded() {
        let factory = new SpaceImpactFactory();
        factory.resetGame(this.engine.scene);
    }
}

new SpaceImpact();

