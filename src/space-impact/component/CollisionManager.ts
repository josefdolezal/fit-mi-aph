import * as PIXI from 'pixi.js';
import { PIXICmp } from "../../../ts/engine/PIXIObject";
import Msg from '../../../ts/engine/Msg';

import { Messages } from '../config/Messages';
import { Flags } from '../config/Flags';
import { States } from '../config/States';
import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";

/**
 * Entity that keeps info about a collision
 */
export class CollisionInfo {
    // hit unit
    collidable: PIXICmp.ComponentObject;
    // projectile that hit given unit
    missile: PIXICmp.ComponentObject;

    constructor(collidable: PIXICmp.ComponentObject, missile: PIXICmp.ComponentObject) {
        this.collidable = collidable;
        this.missile = missile;
    }
}

/**
 * Simple collision manager
 */
export class CollisionManager extends SpaceImpactBaseComponent {
    shipMissileCollidables = new Array<PIXICmp.ComponentObject>();
    shipMissiles = new Array<PIXICmp.ComponentObject>();

    onInit() {
        super.onInit();
        this.subscribe(Messages.MSG_OBJECT_ADDED, Messages.MSG_OBJECT_REMOVED);
    }

    onMessage(msg: Msg) {
        if (msg.action == Messages.MSG_OBJECT_ADDED || msg.action == Messages.MSG_OBJECT_REMOVED) {
            this.shipMissiles = this.scene.findAllObjectsByFlag(Flags.FLAG_MISSILE)
            this.shipMissileCollidables = this.scene.findAllObjectsByFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE);
        }
    }

    onUpdate(delta, absolute) {
        let collides = new Array<CollisionInfo>();

        // O(m^n), we don't suppose there will be more than 50 units in total
        for (let missile of this.shipMissiles) {
            if (missile.getState() != States.STATE_DEAD) {
                for (let collidable of this.shipMissileCollidables) {
                    if (collidable.getState() != States.STATE_DEAD) {
                        let boundsA = missile.getPixiObj().getBounds();
                        let boundsB = collidable.getPixiObj().getBounds();

                        let intersectionX = this.testHorizIntersection(boundsA, boundsB);
                        let intersectionY = this.testVertIntersection(boundsA, boundsB);

                        if (intersectionX > 0 && intersectionY > 0) {
                            // we have a collision
                            collides.push(new CollisionInfo(missile, collidable));
                        }
                    }
                }
            }
        }

        // send message for all colliding objects
        for (let collid of collides) {
            console.log("shot");
            this.sendMessage(Messages.MSG_COLLISION, collid);
        }
    }

    /**
    * Checks horizontal intersection
    */
    private testHorizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): number {
        return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
    }

    /**
     * Checks vertical intersection 
     */
    private testVertIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): number {
        return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
    }
}