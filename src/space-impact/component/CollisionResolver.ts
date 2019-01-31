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
        let collision = <CollisionInfo>msg.data;

        // Ship missile shot enemy
        if(collision.trigger.getTag() == Tags.TAG_SHIP_MISSILE) {
            collision.collidable.setState(States.STATE_DEAD);

            if(collision.collidable.getTag() == Tags.TAG_ENEMY_MISSILE) {
                // The enemy missile shot
                this.model.score += 5;
                collision.collidable.remove();
            } else if (collision.collidable.getTag() == Tags.TAG_ENEMY) {
                // Ship missile shot enemy
                this.model.score += 20;
                collision.collidable.remove();
                this.sendMessage(Messages.MSG_ENEMY_KILLED, collision.collidable);
            }
            
            // Remove missile
            collision.trigger.remove();
        }
        // Enemy shot ship
        else if(collision.trigger.hasFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE)) {
            if(collision.collidable.getTag() == Tags.TAG_SHIP) {
                if(collision.trigger.getTag() == Tags.TAG_ENEMY_MISSILE) {
                    collision.trigger.remove();
                } else if(collision.trigger.getTag() == Tags.TAG_ENEMY) {
                    collision.trigger.remove();
                    this.sendMessage(Messages.MSG_ENEMY_KILLED);
                }

                this.sendMessage(Messages.MSG_SHIP_KILLED, collision.collidable);
            }
        }
    }
}