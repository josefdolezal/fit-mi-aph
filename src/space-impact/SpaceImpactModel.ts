import { EnemyType } from "./model/EnemyType";

export class Wave {
    enemy: EnemyType;
    count: number;

    constructor(enemy: string, count: number) {
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
    currentLevel = 0;
    currentWave = 0;
    enemiesLeft = 0;
    enemyType = EnemyType.Simple;

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
        this.levels = data.levels.map(level => {
            let waves = level.waves.map(wave => {
                return new Wave(wave.enemy, wave.count);
            });

            return new Level(waves);
        });
    }

    loadLevel() {
        // Check if there is another level
        if(this.currentLevel >= this.levels.length - 1) {
            this.isGameOver = true;
            return;
        }
        // Load the level
        this.currentLevel += 1;
        this.currentWave = 0;
        // Load first wave
        this.loadWave();
    }

    protected loadWave() {
        let level = this.levels[this.currentLevel];
        
        if(this.currentWave >= level.waves.length - 1) {
            return;
        }

        this.currentWave += 1;
        this.enemyType = level.waves[this.currentWave].enemy;
        this.enemiesLeft = level.waves[this.currentWave].count;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.isGameOver = false;
    }
}
