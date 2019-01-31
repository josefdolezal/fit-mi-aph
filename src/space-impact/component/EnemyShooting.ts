import { DynamicsComponent } from '../../../ts/components/DynamicsComponent';
import { Point } from 'pixi.js';
import { SpaceImpactModel } from '../SpaceImpactModel';
import { Attributes } from '../config/Attributes';
import SpaceImpactFactory from '../factory/SpaceImpactFactory';
import { Messages } from '../config/Messages';

/** Shooting logic for enemy */
export class EnemyShooting extends DynamicsComponent {
    /** Time of last created missile */
    private lastShot = 0;
    /** Game model */
    protected model: SpaceImpactModel;
    /** Game objects factory */
    protected factory: SpaceImpactFactory;

    onInit() {
        super.onInit();

        let scene = this.owner.getScene();

        this.model = scene.getGlobalAttribute(Attributes.ATTR_MODEL);
        this.factory = scene.getGlobalAttribute(Attributes.ATTR_FACTORY);
    }

    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        // Remove missile if it's off screen
        let globalPos = this.owner.getPixiObj().toGlobal(new Point(0, 0));
        if (globalPos.x > this.scene.app.screen.width)
            this.owner.remove();
    }

    /** Try to shoot enemy missile */
    tryFire(absolute: number): boolean {
        if(absolute - this.lastShot > this.model.enemyShootingRate) {
            this.lastShot = absolute;

            // 70% probability of actual shoot
            if(Math.random() > 0.3) {
                this.factory.createEnemyMissile(this.owner, this.model);
                this.sendMessage(Messages.MSG_ENEMY_MISSILE_SHOT);
            }

            return true;
        }

        return false;
    }
}

/** No shooting strategy (enemy won't shoot) */
export class EnemyNoShooting extends EnemyShooting {

}

/** Enemy shoots without any additional logic  */
export class EnemySimpleShooting extends EnemyShooting {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        this.tryFire(absolute);
    }
}
