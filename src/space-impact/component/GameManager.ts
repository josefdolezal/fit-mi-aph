import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Messages } from "../config/Messages";
import Msg from "../../../ts/engine/Msg";
import { Tags } from "../config/Tags";
import { Flags } from "../config/Flags";

export class GameManager extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        // Subscribe for messages manipulating game state
        this.subscribe(Messages.MSG_SHIP_KILLED);
        this.subscribe(Messages.MSG_ENEMY_ESCAPED);
        this.subscribe(Messages.MSG_ENEMY_KILLED);

        // Load the initial level
        this.model.loadLevel();
    }

    onMessage(msg: Msg) {
        if(this.model.isGameOver) {
            return;
        }

        if(msg.action == Messages.MSG_SHIP_KILLED) {
            this.model.lives = Math.max(0, this.model.lives - 1);

            if(this.model.lives <= 0) {
                this.gameOver();
            }
        } else if(msg.action == Messages.MSG_ENEMY_KILLED || msg.action == Messages.MSG_ENEMY_ESCAPED) {
            this.model.enemiesLeft -= 1;
        }
    }

    onUpdate(delta, absolute) {
        // The game is over
        if(this.model.isGameOver || this.isEnemiesLeft()) {
            return;
        }

        // The should over now
        if(this.isEndOfTheGame()) {
            this.gameOver();
            return;
        }

        if(this.isNextWaveAvailable()) {
            this.model.currentWave += 1;
            this.model.loadWave();
            return
        } else if(this.isNextLevelAvailable()) {
            this.model.currentLevel += 1;
            this.model.loadLevel();
            return;
        }
    }

    protected isEndOfTheGame(): boolean {
        return !this.isEnemiesLeft() && !this.isNextWaveAvailable() && !this.isNextLevelAvailable();
    }

    protected isEnemiesLeft(): boolean {
        return this.model.enemiesLeft > 0 || this.model.enemiesToSpawn > 0
    }

    protected isNextWaveAvailable(): boolean {
        return this.model.currentWave < this.model.wavesCount - 1;
    }

    protected isNextLevelAvailable(): boolean {
        return this.model.currentLevel < this.model.levelsCount - 1;
    }

    protected gameOver() {
        this.model.isGameOver = true;

        // Remove all game related objects
        this.owner.getScene()
            .findAllObjectsByFlag(Flags.FLAG_GAME_OBJECT)
            .forEach(o => o.remove());
        
        this.owner.getScene()
            .findFirstObjectByTag(Tags.TAG_GAME_OVER)
            .getPixiObj()
            .visible = true;

        if(this.model.lives > 0) {
            this.sendMessage(Messages.MSG_GAME_WON);
        } else {
            this.sendMessage(Messages.MSG_GAME_OVER);
        }

        this.scene.invokeWithDelay(5000, () => {
            this.factory.resetGame(this.scene);
        });
    }
}