import * as PIXI from 'pixi.js';
import { PIXICmp } from "../../../ts/engine/PIXIObject";
import Msg from '../../../ts/engine/Msg';

import { Messages } from '../config/Messages';
import { Flags } from '../config/Flags';
import { States } from '../config/States';
import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Tags } from '../config/Tags';

/** Entity that keeps info about a collision */
export class CollisionInfo {
    // Target of collision
    collidable: PIXICmp.ComponentObject;
    // Object that made the collision
    trigger: PIXICmp.ComponentObject;

    constructor(collidable: PIXICmp.ComponentObject, trigger: PIXICmp.ComponentObject) {
        this.collidable = collidable;
        this.trigger = trigger;
    }
}

/** Simple collision manager */
export class CollisionManager extends SpaceImpactBaseComponent {
    /** Objects that collides with ship missile */
    shipMissileCollidables = new Array<PIXICmp.ComponentObject>();
    /** Missiles created by ship/player */
    shipMissiles = new Array<PIXICmp.ComponentObject>();
    /** Collection of existing ships */
    ships = new Array<PIXICmp.ComponentObject>();

    onInit() {
        super.onInit();
        this.subscribe(Messages.MSG_OBJECT_ADDED, Messages.MSG_OBJECT_REMOVED);
    }

    onMessage(msg: Msg) {
        if (msg.action == Messages.MSG_OBJECT_ADDED || msg.action == Messages.MSG_OBJECT_REMOVED) {
            this.shipMissiles = this.scene.findAllObjectsByFlag(Flags.FLAG_MISSILE)
            this.shipMissileCollidables = this.scene.findAllObjectsByFlag(Flags.FLAG_SHIP_MISSILE_COLLIDABLE);
            this.ships = this.scene.findAllObjectsByTag(Tags.TAG_SHIP);
        }
    }

    onUpdate(delta, absolute) {
        let collides = new Array<CollisionInfo>();

        // Check each existing missile with each existing collidable
        for (let missile of this.shipMissiles) {
            if(missile.getState() != States.STATE_DEAD) {
                for (let collidable of this.shipMissileCollidables) {
                    if(collidable.getState() != States.STATE_DEAD) {
                        let boundsA = missile.getPixiObj().getBounds();
                        let boundsB = collidable.getPixiObj().getBounds();

                        let intersectionX = this.testHorizIntersection(boundsA, boundsB);
                        let intersectionY = this.testVertIntersection(boundsA, boundsB);

                        if (intersectionX > 0 && intersectionY > 0) {
                            // we have a collision
                            collides.push(new CollisionInfo(collidable, missile));
                        }
                    }
                }
            }
        }

        // Check all enemy objects if they hit the ship
        for(let ship of this.ships) {
            if(ship.getState() != States.STATE_DEAD) {
                for(let collidable of this.shipMissileCollidables) {
                    if(collidable.getState() != States.STATE_DEAD) {
                        let boundsA = ship.getPixiObj().getBounds();
                        let boundsB = collidable.getPixiObj().getBounds();

                        let intersectionX = this.testHorizIntersection(boundsA, boundsB);
                        let intersectionY = this.testVertIntersection(boundsA, boundsB);

                        if (intersectionX > 0 && intersectionY > 0) {
                            // we have a collision
                            collides.push(new CollisionInfo(ship, collidable));
                        }
                    }
                }
            }
        }

        // Send messages for all shot objects
        for (let collid of collides) {
            this.sendMessage(Messages.MSG_COLLISION, collid);
        }
    }

    /** Checks horizontal intersection */
    private testHorizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): number {
        return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
    }

    /** Checks vertical intersection */
    private testVertIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): number {
        return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
    }
}