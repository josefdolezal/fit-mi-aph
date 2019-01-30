import { DynamicsComponent } from '../../../ts/components/DynamicsComponent';
import { Point } from 'pixi.js';
import { checkTime } from '../Utils';
import { SpaceImpactModel } from '../SpaceImpactModel';
import { Attributes } from '../config/Attributes';
import SpaceImpactFactory from '../factory/SpaceImpactFactory';
import { Messages } from '../config/Messages';

/**
 * Movement logic for projectile
 */
export class EnemyShooting extends DynamicsComponent {

    private lastShot = 0;
    protected model: SpaceImpactModel;
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

    tryFire(absolute: number): boolean {
        if (!checkTime(this.lastShot, absolute, this.model.enemyShootingRate))
            return false;
        
        this.lastShot = absolute;
        this.factory.createEnemyMissile(this.owner, this.model);
        this.sendMessage(Messages.MSG_ENEMY_MISSILE_SHOT);

        return true;
    }
}

export class EnemyNoShooting extends EnemyShooting {

}

export class EnemySimpleShooting extends EnemyShooting {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        // 5% Shooting probability
        if(Math.random() < 0.05)
            this.tryFire(absolute);
    }
}
