import { EnemyType } from "./model/EnemyType";
import { Level } from './model/Level';
import { Wave } from './model/Wave';

/** Game logic state */
export class SpaceImpactModel {
    // ========================= dynamic data
    /** Current game score */
    score = 0;
    /** Current player's lives */
    lives = 3;
    /** Determines whether the game is over */
    isGameOver = false;
    /** Game levels */
    levels: Level[] = [];
    /** Index of current level */
    currentLevel = 0;
    /** Index of current wave in current level */
    currentWave = 0;
    /** Total count of game levels */
    levelsCount = 0;
    /** Total count of waves if current level */
    wavesCount = 0;
    /** How many enemies to spawn in current wave */
    enemiesToSpawn = 0;
    /** How many enemies are currently on screen (living) */
    enemiesLeft = 0;
    /** Type of enemy in current wave */
    enemyType = EnemyType.Simple;

    // ========================= static data
    /** Maximum lives */
    maxLives = 3;
    /** Ship movement speed */
    shipSpeed = 0.02;
    /** Missile movement velocity */
    missileVelocity = 35; 
    /** Enemy movement speed */
    enemySpeed = 10;
    /** Ship's shooting rate */
    shootingRate = 10;
    /** Minimum milliseconds between single enemy shoots */
    enemyShootingRate = 1000;
    /** Enemy vertial movement radius */
    movingEnemyRange = 10;
    /** Number of millisecond between waves */
    afterWaveSpareTime = 1500;
    /** Is currently multiplayer enabled */
    multiplayerEnabled = false;

    constructor() {
        this.reset();
    }

    /** Load model from external data source */
    loadModel(data: any) {
        this.maxLives = data.maxLives;
        this.shipSpeed = data.shipSpeed;
        this.missileVelocity = data.missileVelocity;
        this.enemySpeed = data.enemySpeed;
        this.shootingRate = data.shootingRate;
        this.movingEnemyRange = data.movingEnemyRange;
        this.afterWaveSpareTime = data.afterWaveSpareTime;
        // Create internal levels representation
        this.levels = data.levels.map(level => {
            let waves = level.waves.map(wave => {
                return new Wave(wave.enemy, wave.count);
            });

            return new Level(waves);
        });
        // Set current level information
        this.currentLevel = 0;
        this.levelsCount = this.levels.length;
    }

    // Loads information about current level and it's first wave
    loadLevel() {
        // Check if there is another level
        if(this.currentLevel >= this.levels.length) {
            return;
        }

        this.currentWave = 0;
        this.wavesCount = this.levels[this.currentLevel].waves.length;
        this.loadWave();
    }

    /** Loads information about current wave */
    loadWave() {
        if(this.currentLevel >= this.levels.length || this.currentWave >= this.levels[this.currentLevel].waves.length) {
            return;
        }

        let wave = this.levels[this.currentLevel].waves[this.currentWave];

        this.enemyType = wave.enemy;
        this.enemiesToSpawn = wave.count;
        this.enemiesLeft = 0;
    }

    /** Reset model state to default values */
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
        this.multiplayerEnabled = false;
    }
}
