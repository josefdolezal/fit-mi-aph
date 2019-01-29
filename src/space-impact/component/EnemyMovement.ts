import { DynamicsComponent } from '../../../ts/components/DynamicsComponent';
import { Point } from 'pixi.js';
import Vec2 from '../../../ts/utils/Vec2';
import { SpaceImpactModel } from '../SpaceImpactModel';
import { Attributes } from '../config/Attributes';

export enum MovementDirection {
    Up,
    Down
}

/**
 * Enemy movement type
 */
export class EnemyMovement extends DynamicsComponent {

    model: SpaceImpactModel;

    onInit() {
        super.onInit();

        this.model = this.scene.getGlobalAttribute<SpaceImpactModel>(Attributes.ATTR_MODEL);
    }

    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        // Remove missile if it's off screen
        let globalPos = this.owner.getPixiObj().toGlobal(new Point(0, 0));

        if (globalPos.x < 0)
            this.owner.remove();
    }
}

export class EnemyLinearMovement extends EnemyMovement {
    onInit() {
        super.onInit();

        this.dynamics.velocity = new Vec2(-this.model.enemySpeed, 0);
    }
}

export class EnemyFuzzyMovement extends EnemyMovement {
    protected movementDirection = MovementDirection.Down
    protected upperBound: number;
    protected bottomBound: number;

    constructor(movementDirection: MovementDirection, gameSpeed: number = 1) {
        super(gameSpeed);

        this.movementDirection = movementDirection;
    }

    onInit() {
        super.onInit();

        let position = this.owner.getPixiObj().position;

        if(this.movementDirection == MovementDirection.Up) {
            this.upperBound = position.y - this.model.movingEnemyRange;
            this.bottomBound = position.y;
        } else {
            this.upperBound = position.y;
            this.bottomBound = position.y + this.model.movingEnemyRange;
        }
    }

    onUpdate(delta, absolute) {
        let position = this.owner.getPixiObj().position;

        if(this.movementDirection == MovementDirection.Up && position.y <= this.upperBound) {
            this.movementDirection = MovementDirection.Down;
            this.dynamics.velocity = this.velocityForMovement(this.movementDirection);
        } else if(this.movementDirection == MovementDirection.Down && position.y >= this.bottomBound) {
            this.movementDirection = MovementDirection.Up;
            this.dynamics.velocity = this.velocityForMovement(this.movementDirection);
        }

        super.onUpdate(delta, absolute);
    }

    protected velocityForMovement(movement: MovementDirection): Vec2 {
        let speed = this.model.enemySpeed;

        switch(movement) {
            case MovementDirection.Down: return new Vec2(-speed, speed * 0.75);
            case MovementDirection.Up: return new Vec2(-speed, -speed * 0.75);
        }
    }
}
