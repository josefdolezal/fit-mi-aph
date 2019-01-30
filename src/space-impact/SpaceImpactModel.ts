export class SpaceImpactModel {
    // ========================= dynamic data
    score = 0;
    lives = 100;
    isGameOver = false;
    
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

    }

    reset() {
        this.score = 0;
        this.lives = 100;
        this.isGameOver = false;
    }
}
