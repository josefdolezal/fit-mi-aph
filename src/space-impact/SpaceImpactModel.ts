export class SpaceImpactModel {
    // ========================= dynamic data
    score = 0;
    lives = 100;
    isGameOver = false;
    
    shipSpeed = 0.025;
    missileVelocity = 35; 
    enemySpeed = 25;
    shootingRate = 10;
    movingEnemyRange = 60;

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
