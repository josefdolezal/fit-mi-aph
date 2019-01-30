import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Messages } from "../config/Messages";
import Msg from "../../../ts/engine/Msg";

export class GameManager extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        this.subscribe(Messages.MSG_SHIP_KILLED);
        this.subscribe(Messages.MSG_ENEMY_KILLED);
    }

    onMessage(msg: Msg) {
        console.log("test");
        if(msg.action == Messages.MSG_SHIP_KILLED) {
            console.log(this.model.lives);
            this.model.lives = Math.max(0, this.model.lives - 1);
            console.log(this.model.lives);

            console.log("t");
            
            if(this.model.lives == 0) {
                this.gameOver();
            }
        } else if(msg.action == Messages.MSG_ENEMY_KILLED) {

        }
    }

    protected gameOver() {
        this.model.isGameOver = true;

        console.log("tt");

        // notify everyone interested
        this.sendMessage(Messages.MSG_GAME_OVER);

        this.scene.invokeWithDelay(5000, () => {
            this.factory.resetGame(this.scene);
        });
    }
}