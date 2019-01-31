import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Messages } from "../config/Messages";
import Msg from "../../../ts/engine/Msg";
import { Tags } from "../config/Tags";
import { Flags } from "../config/Flags";

/** Manages game logic */
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
        // The game is over or in progress
        if(this.model.isGameOver || this.isEnemiesLeft()) {
            return;
        }

        // The game is over and no new enemies will be spawn
        if(this.isEndOfTheGame()) {
            this.gameOver();
            return;
        }

        // No enemies but the game is not over, create new wave or level
        if(this.isNextWaveAvailable()) {
            this.model.currentWave += 1;
            this.model.loadWave();
            return
        } else if(this.isNextLevelAvailable()) {
            this.model.currentLevel += 1;
            this.model.score += 50;
            this.sendMessage(Messages.MSG_LEVEL_CLEARED);
            this.model.loadLevel();
            return;
        }
    }

    /** Determines whether the game can continue or is over yet */
    protected isEndOfTheGame(): boolean {
        return !this.isEnemiesLeft() && !this.isNextWaveAvailable() && !this.isNextLevelAvailable();
    }

    /** Determines whether there will be any enemies in current wave */
    protected isEnemiesLeft(): boolean {
        return this.model.enemiesLeft > 0 || this.model.enemiesToSpawn > 0
    }

    /** Determines whether there will be next wave */
    protected isNextWaveAvailable(): boolean {
        return this.model.currentWave < this.model.wavesCount - 1;
    }

    /** Determines whether ther will be next level */
    protected isNextLevelAvailable(): boolean {
        return this.model.currentLevel < this.model.levelsCount - 1;
    }

    /** Ends the game */
    protected gameOver() {
        this.model.isGameOver = true;

        // Remove all game related objects
        this.owner.getScene()
            .findAllObjectsByFlag(Flags.FLAG_GAME_OBJECT)
            .forEach(o => o.remove());
        
        // Show game over/won info
        this.owner.getScene()
            .findFirstObjectByTag(Tags.TAG_GAME_OVER)
            .getPixiObj()
            .visible = true;

        // Send appropriate messages
        if(this.model.lives > 0) {
            this.sendMessage(Messages.MSG_GAME_WON);
        } else {
            this.sendMessage(Messages.MSG_GAME_OVER);
        }

        // Run the game again with delay
        this.scene.invokeWithDelay(5000, () => {
            this.factory.resetGame(this.scene);
        });
    }
}