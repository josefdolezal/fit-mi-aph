import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Messages } from "../config/Messages";
import Msg from "../../../ts/engine/Msg";
import { Tags } from "../config/Tags";
import { Flags } from "../config/Flags";

export class GameManager extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        this.subscribe(Messages.MSG_SHIP_KILLED);
        this.subscribe(Messages.MSG_ENEMY_ESCAPED);
        this.subscribe(Messages.MSG_ENEMY_KILLED);
    }

    onMessage(msg: Msg) {
        if(this.model.isGameOver) {
            return;
        }

        if(msg.action == Messages.MSG_SHIP_KILLED) {
            this.model.lives = Math.max(0, this.model.lives - 1);
            
            if(this.model.lives == 0) {
                this.gameOver();
            }
        } else if(msg.action == Messages.MSG_ENEMY_KILLED || msg.action == Messages.MSG_ENEMY_ESCAPED) {
            this.model.enemiesLeft -= 1;
            
            // We hit the enemy, check if it's end of the game
            if(this.isGameWon()) {
                this.gameOver();
            }
        }
    }

    protected isGameWon(): boolean {
        return this.model.currentLevel == this.model.levels.length - 1 && this.model.enemiesLeft <= 0;
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