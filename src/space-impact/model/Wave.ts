import { EnemyType } from './EnemyType';

/** Wave of enemies used to create level */
export class Wave {
    /** Type of the enemy representing the wave */
    enemy: EnemyType;
    /** Number of enemies of this type */
    count: number;

    constructor(enemy: string, count: number) {
        /** Parse enemy type from string */
        switch(enemy) {
            case "simple":
                this.enemy = EnemyType.Simple;
                break;
            case "moving":
                this.enemy = EnemyType.Moving;
                break;
            case "shooting":
                this.enemy = EnemyType.Shooting;
                break;    
        }

        this.count = count;
    }
}
