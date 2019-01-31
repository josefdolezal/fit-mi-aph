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
    levelsCount = 0;
    wavesCount = 0;
    enemiesToSpawn = 0;
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
    afterWaveSpareTime = 1500;

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
        this.afterWaveSpareTime = data.afterWaveSpareTime;
        this.levels = data.levels.map(level => {
            let waves = level.waves.map(wave => {
                return new Wave(wave.enemy, wave.count);
            });

            return new Level(waves);
        });
        this.currentLevel = 0;
        this.levelsCount = this.levels.length;
    }

    // Adds next level and loads it's first wave.
    loadLevel() {
        // Check if there is another level
        if(this.currentLevel >= this.levels.length - 1) {
            this.isGameOver = true;
            return;
        }

        this.currentWave = 0;
        this.wavesCount = this.levels[this.currentLevel].waves.length;
        this.loadWave();
    }

    loadWave() {
        // Check 
        if(this.currentLevel >= this.levels.length || this.currentWave >= this.levels[this.currentWave].waves.length) {
            return;
        }

        let wave = this.levels[this.currentLevel].waves[this.currentWave];

        this.enemyType = wave.enemy;
        this.enemiesToSpawn = wave.count;
        this.enemiesLeft = 0;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.isGameOver = false;
        this.currentLevel = 0;
        this.currentWave = 0;
        this.levelsCount = 0;
        this.wavesCount = 0;
        this.enemiesLeft = 0;
        this.enemiesToSpawn = 0;
        this.enemiesLeft = 0;
    }
}
