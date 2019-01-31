import Msg from '../../../ts/engine/Msg';

import { States } from '../config/States';
import { Messages } from '../config/Messages';
import { Flags } from '../config/Flags';
import { CollisionInfo } from './CollisionManager';
import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Tags } from '../config/Tags';
import { PIXICmp } from '../../../ts/engine/PIXIObject';

/** Resolves all objects collisions */
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

    /** Handle the collision */
    protected handleCollision(msg: Msg) {
        let collision = <CollisionInfo>msg.data;

        // Ship missile shot enemy
        if(collision.trigger.getTag() == Tags.TAG_SHIP_MISSILE) {
            if(collision.collidable.getTag() == Tags.TAG_ENEMY_MISSILE) {
                // The enemy missile shot
                this.model.score += 5;
                this.safeRemove(collision.collidable);
            } else if (collision.collidable.getTag() == Tags.TAG_ENEMY) {
                // Ship missile shot enemy
                this.model.score += 20;
                this.safeRemove(collision.collidable);
                this.sendMessage(Messages.MSG_ENEMY_KILLED, collision.collidable);
            }
            
            // Remove missile
            collision.collidable.setState(States.STATE_DEAD);
            collision.trigger.setState(States.STATE_DEAD);
            this.safeRemove(collision.trigger);
        }
        // Enemy shot ship
        else if(collision.trigger.hasFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE)) {
            if(collision.collidable.getTag() == Tags.TAG_SHIP) {
                if(collision.trigger.getTag() == Tags.TAG_ENEMY_MISSILE) {
                    this.safeRemove(collision.trigger);
                } else if(collision.trigger.getTag() == Tags.TAG_ENEMY) {
                    this.safeRemove(collision.trigger);
                    this.sendMessage(Messages.MSG_ENEMY_KILLED);
                }

                collision.trigger.setState(States.STATE_DEAD);

                this.sendMessage(Messages.MSG_SHIP_KILLED, collision.collidable);
            }
        }
    }

    /** Remove object from scene safely (so it's not removed multiple times) */
    protected safeRemove(object: PIXICmp.ComponentObject) {
        if(object.getPixiObj().parent != null) {
            object.remove();
        }
    }
}