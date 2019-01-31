import { EnemyType } from "./model/EnemyType";

export class Wave {
    enemy: EnemyType;
    count: number;

    constructor(enemy: EnemyType, count: number) {
        this.enemy = enemy;
        this.count = count;
    }
}

export class Level {
    waves: Wave[];

    constructor(waves: Wave[]) {
        this.waves = waves;
    }
}

export class SpaceImpactModel {
    // ========================= dynamic data
    score = 0;
    lives = 3;
    isGameOver = false;
    levels: Level[] = [];
    
    // ========================= static data
    maxLives = 3;
    shipSpeed = 0.02;
    missileVelocity = 35; 
    enemySpeed = 10;
    shootingRate = 10;
    enemyShootingRate = 5;
    movingEnemyRange = 10;

    constructor() {
        this.reset();
    }

    loadModel(data: any) {
        this.maxLives = data.maxLives;
        this.shipSpeed = data.shipSpeed;
        this.missileVelocity = data.missileVelocity;
        this.enemySpeed = data.enemySpeed;
        this.shootingRate = data.shootingRate;
        this.movingEnemyRange = data.movingEnemyRange;
        this.levels = data.levels;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.isGameOver = false;
    }
}
