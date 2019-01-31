import { ATTR_DYNAMICS } from '../../../ts/engine/Constants';
import { SpaceImpactModel } from '../SpaceImpactModel';
import { PIXICmp } from '../../../ts/engine/PIXIObject';
import PIXIObjectBuilder from '../../../ts/engine/PIXIObjectBuilder';
import Vec2 from '../../../ts/utils/Vec2';
import { KeyInputComponent } from '../../../ts/components/KeyInputComponent';
import Scene from '../../../ts/engine/Scene';
import DebugComponent from '../../../ts/components/DebugComponent';
import { GenericComponent } from '../../../ts/components/GenericComponent';
import Dynamics from '../../../ts/utils/Dynamics';
import ChainingComponent from '../../../ts/components/ChainingComponent';

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
import { Container, Point } from 'pixi.js';
import { LivesComponent } from '../component/LivesComponent';
import { ScoreComponent } from '../component/ScoreComponent';
import { GameManager} from '../component/GameManager';
import { GamerOverComponent } from '../component/GameOverComponent';
import { IntroComponent } from '../component/IntroComponent';
import { EnemySpawner } from '../component/EnemySpawner';

export default class SpaceImpactFactory {

    // global scale for sprites, calculated in Paratrooper.ts
    static globalScale = 1;
    // width of the screen, depends on current aspect ratio
    // calculated in Paratrooper.ts
    static screenWidth = 1;

    initializeGame(rootObject: PIXICmp.ComponentObject, model: SpaceImpactModel, showIntro: boolean) {
        let scene = rootObject.getScene();
        let builder = new PIXIObjectBuilder(scene);

        builder
            .withComponent(new KeyInputComponent())
            .withComponent(new GameManager())
            .withComponent(new SoundComponent())
            .withComponent(new CollisionManager())
            .withComponent(new CollisionResolver())
            .build(rootObject);

        this.createGround(rootObject);
        
        if(showIntro) {
            this.createIntro(rootObject, model);
        } else {
            this.startGame(rootObject, model);
        }
    }

    startGame(rootObject: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        this.createGameOver(rootObject);
        this.createLives(rootObject, model);
        this.createScore(rootObject, model);
        this.createShip(rootObject, model);

        rootObject.addComponent(new EnemySpawner());
    }

    createIntro(owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene();

        new PIXIObjectBuilder(scene)
            .relativePos(0.5, 0.5)
            .anchor(0.5, 0.5)
            .scale(SpaceImpactFactory.globalScale)
            .withComponent(new IntroComponent())
            .build(new PIXICmp.Sprite(Tags.TAG_INTRO, PIXI.Texture.fromImage(Resources.TEXTURE_TAG_INTRO)), scene.stage);
    }

    createLives(owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene()
        let container = new PIXICmp.Container(Tags.TAG_LIVES);

        new PIXIObjectBuilder(scene)
            .globalPos(1, 1)
            .anchor(0, 0)
            .scale(SpaceImpactFactory.globalScale)
            .withFlag(Flags.FLAG_GAME_OBJECT)
            .withComponent(new LivesComponent())
            .build(container, scene.stage);
    }

    createScore(owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene();
        let text = new PIXICmp.Text(Tags.TAG_SCORE);
        text.style = this.defaultTextStyle()

        new PIXIObjectBuilder(scene)
            .relativePos(0.99, 0.01)
            .anchor(1, 0)
            .scale(SpaceImpactFactory.globalScale)
            .withFlag(Flags.FLAG_GAME_OBJECT)
            .withComponent(new ScoreComponent())
            .build(text, scene.stage)
    }

    createShip(owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene();

        new PIXIObjectBuilder(scene)
            .relativePos(0.1, 0.5)
            .anchor(0, 0.5)
            .scale(SpaceImpactFactory.globalScale)
            .withFlag(Flags.FLAG_GAME_OBJECT)
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
            .withFlag(Flags.FLAG_GAME_OBJECT)
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
            .withFlag(Flags.FLAG_GAME_OBJECT)
            .withAttribute(Attributes.ATTR_DYNAMICS, dynamics)
            .withComponent(new MissileComponent())
            .build(sprite, rootObject);
    }

    createEnemy(type: EnemyType, owner: PIXICmp.ComponentObject, model: SpaceImpactModel) {
        let scene = owner.getScene();
        let rootObject = scene.stage;
        let screenHeight = scene.app.screen.height;

        let sprite = this.enemySprite(type);
        
        // Random on-screen vertical position
        let position = Math.max(sprite.height / 2, Math.min(screenHeight - sprite.height / 2, Math.random() * screenHeight));

        new PIXIObjectBuilder(scene)
            .scale(SpaceImpactFactory.globalScale)
            .anchor(0, 0.5)
            .globalPos(scene.app.screen.width, position)
            .withFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE)
            .withFlag(Flags.FLAG_GAME_OBJECT)
            .withComponent(this.enemyMovement(type))
            .withComponent(this.enemyShooting(type))
            .build(sprite, rootObject);
    }

    createGameOver(owner: PIXICmp.ComponentObject) {
        let scene = owner.getScene();
        let text = new PIXICmp.Text(Tags.TAG_GAME_OVER);
        let style = this.defaultTextStyle()
        
        style.fontSize = 45;
        style.align = "center";
        text.style = style;
        text.visible = false;

        new PIXIObjectBuilder(scene)
            .relativePos(0.5, 0.5)
            .anchor(0.5, 0.5)
            .scale(SpaceImpactFactory.globalScale)
            .withComponent(new GamerOverComponent())
            .build(text, scene.stage)
    }

    protected defaultTextStyle(): PIXI.TextStyle {
        return new PIXI.TextStyle({
            fontFamily: "Comfont",
            fill: "0x000000"
        });
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
 
    resetGame(scene: Scene, showIntro: boolean = false) {
        scene.clearScene();
        let model = new SpaceImpactModel();
        model.loadModel(PIXI.loader.resources[Resources.DATA_CONFIG].data);
        scene.addGlobalAttribute(Attributes.ATTR_FACTORY, this);
        scene.addGlobalAttribute(Attributes.ATTR_MODEL, model);
        this.initializeGame(scene.stage, model, showIntro);
    }
}