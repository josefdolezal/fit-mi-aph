import { Wave } from './Wave';

/** Represents game level */
export class Level {
    /** Waves of enemies in this level */
    waves: Wave[];

    constructor(waves: Wave[]) {
        this.waves = waves;
    }
}