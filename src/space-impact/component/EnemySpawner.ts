import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';
import { Messages } from '../config/Messages';
import Msg from '../../../ts/engine/Msg';

export class EnemySpawner extends SpaceImpactBaseComponent {
    
    private lastSpawn = 0;

    onInit() {
        super.onInit();

        this.subscribe(Messages.MSG_ENEMY_KILLED);
    }

    onMessage(msg: Msg) {
        if(msg.action == Messages.MSG_ENEMY_KILLED) {
            // Add spare time between waves
            if(this.model.enemiesLeft == 0) {
                this.lastSpawn += this.model.afterWaveSpareTime;
            }
        }
    }

    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        if(this.model.isGameOver) {
            return;
        }

        // Spawn twice a second
        if(absolute - this.lastSpawn > 800 && this.model.enemiesToSpawn > 0) {
            this.lastSpawn = absolute;

            let type = this.model.enemyType;
            let stage = this.owner.getScene().stage;

            this.model.enemiesLeft += 1;
            this.model.enemiesToSpawn -= 1;
            this.factory.createEnemy(type, stage, this.model);
        }
    }
}