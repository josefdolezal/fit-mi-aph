import { PixiRunner } from '../../ts/PixiRunner'
import SpaceImpactFactory from './factory/SpaceImpactFactory';
import {
    SPRITES_RESOLUTION_HEIGHT, SCENE_HEIGHT,
} from './config/Constants';
import { Resources } from './config/Resources';

/** Game entry point */
class SpaceImpact {
    /** The game engine */
    engine: PixiRunner;

    constructor() {
        this.engine = new PixiRunner();

        let canvas = (document.getElementById("gameCanvas") as HTMLCanvasElement);

        let screenHeight = canvas.height;
        
        // Calculate ratio between intended resolution (here 400px of height) and real resolution
        let gameScale = SPRITES_RESOLUTION_HEIGHT / screenHeight;
        // Scale the scene to 50 units if height
        let resolution = screenHeight / SCENE_HEIGHT * gameScale;
        this.engine.init(canvas, resolution / gameScale);

        // Det global scale which has to be applied for ALL sprites as it will
        SpaceImpactFactory.globalScale = 1 / resolution;

        // Set resized width according to the current aspect ratio
        SpaceImpactFactory.screenWidth = SCENE_HEIGHT * (canvas.width / canvas.height);
        
        // Load all necessary game resources
        PIXI.loader
            .reset()    // necessary for hot reload
            .add(Resources.TEXTURE_TAG_SHIP, 'static/ship.png')
            .add(Resources.TEXTURE_TAG_MISSILE, 'static/missile.png')
            .add(Resources.TEXTURE_TAG_SIMPLE_ENEMY, 'static/simple_enemy.png')
            .add(Resources.TEXTURE_TAG_MOVING_ENEMY, 'static/moving_enemy.png')
            .add(Resources.TEXTURE_TAG_SHOOTING_ENEMY, 'static/shooting_enemy.png')
            .add(Resources.TEXTURE_TAG_INTRO, 'static/intro.png')
            .add(Resources.TEXTURE_TAG_LIVE, 'static/live.png')
            .add(Resources.SOUND_SHIP_SHOT, 'static/shot.mp3')
            .add(Resources.SOUND_ENEMY_SHOT, 'static/shot.mp3')
            .add(Resources.SOUND_GAME_OVER, 'static/game_over.mp3')
            .add(Resources.SOUND_EXPLOSION, 'static/explosion.mp3')
            .add(Resources.SOUND_GAME_WON, 'static/game_won.mp3')
            .add(Resources.SOUND_LEVEL_CLEARED, 'static/level_cleared.mp3')
            .add(Resources.DATA_CONFIG, 'static/config.json')
            .load(() => this.onAssetsLoaded());
    }

    onAssetsLoaded() {
        let factory = new SpaceImpactFactory();
        factory.resetGame(this.engine.scene, true);
    }
}

// Start the game
new SpaceImpact();
