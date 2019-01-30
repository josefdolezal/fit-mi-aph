import { ATTR_DYNAMICS } from '../../../ts/engine/Constants';
// import { SoundComponent } from './SoundComponent';
import { SpaceImpactModel } from '../SpaceImpactModel';
import { PIXICmp } from '../../../ts/engine/PIXIObject';
// import { CopterSpawner } from './CopterSpawner';
// import { GameManager } from './GameManager';
// import { CannonInputController } from './CannonController';
import PIXIObjectBuilder from '../../../ts/engine/PIXIObjectBuilder';
import Vec2 from '../../../ts/utils/Vec2';
// import { ParatrooperComponent } from './ParatrooperComponent';
import { KeyInputComponent } from '../../../ts/components/KeyInputComponent';
import Scene from '../../../ts/engine/Scene';
import DebugComponent from '../../../ts/components/DebugComponent';
import { GenericComponent } from '../../../ts/components/GenericComponent';
import Dynamics from '../../../ts/utils/Dynamics';
// import { CopterMovement } from './CopterMovement';
import ChainingComponent from '../../../ts/components/ChainingComponent';
// import { DeathAnimation } from './DeathAnimation';
// import { CollisionResolver } from './CollisionResolver';

import { ShipArrowInputController } from "../component/ShipController";

import { Attributes } from '../config/Attributes';
import { Resources } from '../config/Resources';
import { Tags } from '../config/Tags';
import { Flags } from '../config/Flags'
import { MissileComponent } from '../component/MissileComponent';
import { EnemyType } from '../model/EnemyType';
import { EnemyMovement, EnemyLinearMovement, EnemyFuzzyMovement, MovementDirection } from '../component/EnemyMovement';
import { EnemyShooting, EnemyNoShooting, EnemySimpleShooting } from '../component/EnemyShooting';
import { CollisionManager } from '../component/CollisionManager';
import { CollisionResolver } from '../component/CollisionResolver';
import { SoundComponent } from '../component/SoundManager';

export default class SpaceImpactFactory {

    // global scale for sprites, calculated in Paratrooper.ts
    static globalScale = 1;
    // width of the screen, depends on current aspect ratio
    // calculated in Paratrooper.ts
    static screenWidth = 1;

    initializeGame(rootObject: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = rootObject.getScene();
        let builder = new PIXIObjectBuilder(scene);

        // ============================================================================================================
        // special component that will wait for a death of a unit, executes a DeathAnimation
        // upon it and removes it from the scene
        // let deathChecker = new GenericComponent("DeathChecker") // anonymous generic component
        //     .doOnMessage(MSG_UNIT_KILLED, (cmp, msg) => {    // wait for message MSG_UNIT_KILLED
        //         let contextObj = msg.data as PIXICmp.ComponentObject; // take the killed object from message payload
        //         contextObj.addComponent(new ChainingComponent() // add chaining component that will execute two closure
        //             .addComponentAndWait(new DeathAnimation()) // firstly, add directly DeathAnimation to the object and wait until it finishes
        //             .execute((cmp) => contextObj.remove())); // secondly, remove the object from the scene
        //     });
        // ============================================================================================================


        // add root components
        builder
            .withComponent(new KeyInputComponent())
        //     // .withComponent(new GameManager())
            .withComponent(new SoundComponent())
        //     // .withComponent(new CopterSpawner())
            .withComponent(new CollisionManager())
            .withComponent(new CollisionResolver())
        //     // .withComponent(deathChecker)
        //     //.withComponent(new DebugComponent(document.getElementById("debugSect")))
            .build(rootObject);

        this.createGround(rootObject);
        this.createShip(rootObject, model);
        this.createSimpleEnemy(rootObject, model);

        // create labels
        // score
        // let score = new PIXICmp.Text(TAG_SCORE);
        // score.style = new PIXI.TextStyle({
        //     fill: "0xFFFFFF"
        // })
        // builder.relativePos(1.0, 1.01).scale(ParatrooperFactory.globalScale).anchor(1, 1)
        //     .withComponent(new GenericComponent("ScoreComponent").doOnUpdate((cmp, delta, absolute) => {
        //         let score = "SCORE: " + model.score.toFixed(2);
        //         let text = <PIXI.Text>cmp.owner.getPixiObj();
        //         text.text = score;
        //     }))
        //     .build(score, rootObject);

        // // game over label
        // let text = "GAME OVER";
        // let gameOver = new PIXICmp.Text(TAG_GAMEOVER, text);
        // gameOver.style = new PIXI.TextStyle({
        //     fill: "0xFFFFFF"
        // })
        // gameOver.visible = false;
        // builder.relativePos(0.5, 0.5).scale(ParatrooperFactory.globalScale).anchor(0.5, 0.5).build(gameOver, rootObject);

        // // number of lives
        // let lives = new PIXICmp.Text(TAG_LIVES);
        // lives.style = new PIXI.TextStyle({
        //     fill: "0xFFFFFF"
        // })
        // builder.relativePos(0, 1.01).scale(ParatrooperFactory.globalScale).anchor(0, 1)
        //     .withComponent(new GenericComponent("LivesComponent").doOnUpdate((cmp, delta, absolute) => {
        //         let lives = "LIVES: " + Math.max(0, model.maxLandedUnits - model.landedUnits);
        //         let text = <PIXI.Text>cmp.owner.getPixiObj();
        //         text.text = lives;
        //     }))
        //     .build(lives, rootObject);
    }

    addIntro(scene: Scene, model: SpaceImpactModel) {
        let builder = new PIXIObjectBuilder(scene);

        // stage components
        builder
        // .withComponent(new SoundComponent())
        // .withComponent(new IntroComponent())
        .build(scene.stage)

        // // title
        // builder
        // .relativePos(0.5, 0.25)
        // .anchor(0.5)
        // // .scale(Factory.globalScale)
        // .build(new PIXICmp.Sprite(TAG_TITLE, this.createTexture(model.getSpriteInfo(TAG_TITLE))), scene.stage);

        // ship
       
    }

    createShip(owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene();

        new PIXIObjectBuilder(scene)
            .relativePos(0.1, 0.5)
            .anchor(0, 0.5)
            .scale(SpaceImpactFactory.globalScale)
            .withComponent(new ShipArrowInputController())
            .build(new PIXICmp.Sprite(Tags.TAG_SHIP, PIXI.Texture.fromImage(Resources.TEXTURE_TAG_SHIP)), scene.stage);
    }

    createGround(owner: PIXICmp.ComponentObject) {
        let ground = new PIXICmp.Graphics(Tags.TAG_GROUND);

        ground.beginFill(0x95BB49);
        ground.drawRect(0, 0, SpaceImpactFactory.screenWidth, SpaceImpactFactory.screenWidth);
        ground.endFill();
        owner.getPixiObj().addChild(ground);
    }

    createMissile(ship: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let dynamics = new Dynamics(new Vec2(model.missileVelocity, 0));
        let rootObject = ship.getScene().stage;
        let shipPixi = ship.getPixiObj();
        let shipPosition = shipPixi.toGlobal(new PIXI.Point(0, 0));

        new PIXIObjectBuilder(ship.getScene())
            .scale(SpaceImpactFactory.globalScale)
            .anchor(0, 0.5)
            .globalPos(shipPosition.x + shipPixi.width, shipPosition.y)
            .withFlag(Flags.FLAG_MISSILE)
            .withAttribute(Attributes.ATTR_DYNAMICS, dynamics)
            .withComponent(new MissileComponent())
            .build(new PIXICmp.Sprite(Tags.TAG_SHIP_MISSILE, PIXI.Texture.fromImage(Resources.TEXTURE_TAG_MISSILE)), rootObject);
    }

    createEnemyMissile(enemy: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let dynamics = new Dynamics(new Vec2(-model.missileVelocity, 0));
        let scene = enemy.getScene();
        let rootObject = scene.stage;
        let enemyPixi = enemy.getPixiObj();
        let enemyPosition = enemyPixi.toGlobal(new PIXI.Point(0, 0));
        let sprite = new PIXICmp.Sprite(Tags.TAG_ENEMY_MISSILE, PIXI.Texture.fromImage(Resources.TEXTURE_TAG_MISSILE));
        
        new PIXIObjectBuilder(scene)
            .scale(SpaceImpactFactory.globalScale)
            .anchor(0, 0.5)
            .globalPos(enemyPosition.x - (sprite.width * SpaceImpactFactory.globalScale), enemyPosition.y)
            .withFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE)
            .withAttribute(Attributes.ATTR_DYNAMICS, dynamics)
            .withComponent(new MissileComponent())
            .build(sprite, rootObject);
    }

    createSimpleEnemy(owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene();
        let rootObject = scene.stage;
        let screenHeight = scene.app.screen.height;
        
        let type = EnemyType.Shooting;
        let sprite = this.enemySprite(type);
        
        // Random on-screen vertical position
        let position = Math.max(sprite.height / 2, Math.min(screenHeight - sprite.height / 2, Math.random() * screenHeight));

        new PIXIObjectBuilder(scene)
            .scale(SpaceImpactFactory.globalScale)
            .anchor(0, 0.5)
            .globalPos(scene.app.screen.width, position)
            .withFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE)
            .withComponent(this.enemyMovement(type))
            .withComponent(this.enemyShooting(type))
            .build(sprite, rootObject);
    }

    protected enemyMovement(enemyType: EnemyType): EnemyMovement {
        switch (enemyType) {
            case EnemyType.Simple:
            case EnemyType.Shooting:
                return new EnemyLinearMovement();
            case EnemyType.Moving:
                return new EnemyFuzzyMovement(MovementDirection.Up);
        }
    }

    protected enemySprite(enemyType: EnemyType): PIXICmp.Sprite {
        let resource: string

        switch (enemyType) {
            case EnemyType.Simple:
                resource = Resources.TEXTURE_TAG_SIMPLE_ENEMY;
                break;
            case EnemyType.Moving:
                resource = Resources.TEXTURE_TAG_MOVING_ENEMY;
                break;
            case EnemyType.Shooting:
                resource = Resources.TEXTURE_TAG_SHOOTING_ENEMY;
                break;
        }

        return new PIXICmp.Sprite(Tags.TAG_ENEMY, PIXI.Texture.fromImage(resource));
    }

    protected enemyShooting(enemyType: EnemyType): EnemyShooting {
        switch(enemyType) {
            case EnemyType.Simple: return new EnemyNoShooting();
            case EnemyType.Shooting:
            case EnemyType.Moving: return new EnemySimpleShooting();
        }
    }

    // createParatrooper(owner: PIXICmp.ComponentObject, model: ParatrooperModel) {
    //     let dynamics = new Dynamics();
    //     dynamics.aceleration = new Vec2(0, model.gravity);

    //     new PIXIObjectBuilder(owner.getScene())
    //         .scale(ParatrooperFactory.globalScale)
    //         .anchor(0.5, 1)
    //         .withFlag(FLAG_COLLIDABLE)
    //         .localPos(owner.getPixiObj().position.x, owner.getPixiObj().position.y)
    //         .withAttribute(ATTR_DYNAMICS, dynamics)
    //         .withComponent(new ParatrooperComponent())
    //         .withState(STATE_FALLING)
    //         .build(new PIXICmp.Sprite(TAG_PARATROOPER, PIXI.Texture.fromImage(TEXTURE_PARATROOPER)), owner.getScene().stage);
    // }

    // createCopter(owner: PIXICmp.ComponentObject, model: ParatrooperModel) {
    //     let root = owner.getScene().stage;

    //     // 50% probability that the copter will be spawned on the left side
    //     let spawnLeft = Math.random() > 0.5;
    //     let posY = Math.random() * (model.copterSpawnMaxY - model.copterSpawnMinY) + model.copterSpawnMinY;
    //     let posX = spawnLeft ? -0.2 : 1.2;
    //     let velocity = (spawnLeft ? 1 : -1) * Math.random() * (model.copterMaxVelocity - model.copterMinVelocity) + model.copterMinVelocity;
    //     let dynamics = new Dynamics();
    //     dynamics.velocity = new Vec2(velocity, 0);

    //     new PIXIObjectBuilder(owner.getScene())
    //         .withFlag(FLAG_COLLIDABLE)
    //         .withAttribute(ATTR_DYNAMICS, dynamics)
    //         .withComponent(new CopterComponent())
    //         .withComponent(new CopterMovement())
    //         .withComponent(new CopterAnimator())
    //         .relativePos(posX, posY)
    //         .anchor(0.5, 0.5)
    //         .scale(ParatrooperFactory.globalScale)
    //         .build(new PIXICmp.Sprite(TAG_COPTER, PIXI.Texture.fromImage(TEXTURE_COPTER_LEFT)), root);
    // }

    resetGame(scene: Scene) {
        scene.clearScene();
        let model = new SpaceImpactModel();
        // model.loadModel(PIXI.loader.resources[DATA_JSON].data);
        scene.addGlobalAttribute(Attributes.ATTR_FACTORY, this);
        scene.addGlobalAttribute(Attributes.ATTR_MODEL, model);
        this.initializeGame(scene.stage, model);
    }
}