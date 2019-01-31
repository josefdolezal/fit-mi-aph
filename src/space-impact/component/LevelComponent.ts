import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import Msg from "../../../ts/engine/Msg";
import { Messages } from "../config/Messages";

/** Takes care of on screen level information */
export class LevelComponent extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        this.subscribe(Messages.MSG_LEVEL_CLEARED);
    }

    onMessage(msg: Msg) {
        // Show level info when the level is completed
        if(msg.action == Messages.MSG_LEVEL_CLEARED) {
            this.owner.getPixiObj().visible = true;

            // Hide the info with delay
            this.owner.getScene().invokeWithDelay(2000, () => {
                this.owner.getPixiObj().visible = false;
            });
        }
    }

    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        // Update the hidden text on every game update
        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text = "Level " + (this.model.currentLevel + 1);
    }
}