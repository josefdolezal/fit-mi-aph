import Msg from '../../../ts/engine/Msg';

import { States } from '../config/States';
import { Messages } from '../config/Messages';
import { Flags } from '../config/Flags';
import { CollisionInfo } from './CollisionManager';
import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Tags } from '../config/Tags';

/**
 * Collision resolver component
 */
export class CollisionResolver extends SpaceImpactBaseComponent {

    onInit() {
        super.onInit();
        this.subscribe(Messages.MSG_COLLISION);
    }

    onMessage(msg: Msg) {
        if (this.model.isGameOver) {
            return;
        }

        if (msg.action == Messages.MSG_COLLISION) {
            this.handleCollision(msg);
        }
    }

    // handles collision with all objects
    protected handleCollision(msg: Msg) {
        let trigger = <CollisionInfo>msg.data;

        if(trigger.missile.getTag() == Tags.TAG_SHIP_MISSILE) {
            if(trigger.collidable.getTag() == Tags.TAG_ENEMY_MISSILE) {
                this.model.score += 5;
                trigger.collidable.setState(States.STATE_DEAD);
            } else if (trigger.collidable.getTag() == Tags.TAG_ENEMY) {

            }
        } else {
            // enemy missile
        }

        trigger.missile.remove();
        trigger.collidable.remove();

        // if (trigger.unit.getTag() == TAG_COPTER) {
        //     // copter hit -> increase score and change state
        //     this.model.score += this.model.copterReward;
        //     trigger.unit.setState(STATE_DEAD);
        //     this.sendMessage(MSG_UNIT_KILLED, trigger.unit);
        // } else if (trigger.unit.getTag() == TAG_PARATROOPER) {
        //     // we can either kill the paratrooper or remove his parachute and let him fall
        //     if (trigger.unit.getState() == STATE_FALLING) {
        //         // paratrooper hit while falling
        //         this.model.score += this.model.paratrooperShotReward;
        //         trigger.unit.setState(STATE_DEAD);
        //         this.sendMessage(MSG_UNIT_KILLED, trigger.unit);
        //     } else {
        //         // paratrooper hit while landing
        //         let unitBB = trigger.unit.getPixiObj().getBounds();
        //         let projectileBB = trigger.projectile.getPixiObj().getBounds();
        //         let state = trigger.unit.getState();

        //         if (state == STATE_FALLING_PARACHUTE && projectileBB.top <= (unitBB.bottom - unitBB.height / 2)) {
        //             // remove parachute -> paratrooper is gonna be killed by gravity
        //             trigger.unit.setState(STATE_FALLING_WITHOUT_PARACHUTE);
        //         } else {
        //             // we hit the paratrooper's body -> kill him
        //             trigger.unit.setState(STATE_DEAD);
        //             this.sendMessage(MSG_UNIT_KILLED, trigger.unit);
        //         }

        //         // reward is different -> we hit the paratrooper too late
        //         this.model.score += this.model.paratrooperFallingReward;
        //     }
        // }

        // trigger.projectile.remove();
    }
}