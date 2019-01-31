import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import Msg from "../../../ts/engine/Msg";
import { Messages } from "../config/Messages";

export class LevelComponent extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        console.log("t2");

        this.subscribe(Messages.MSG_LEVEL_CLEARED);
    }

    onMessage(msg: Msg) {
        if(msg.action == Messages.MSG_LEVEL_CLEARED) {
            console.log("msg");
            this.owner.getPixiObj().visible = true;
            this.owner.getScene().invokeWithDelay(2000, () => {
                this.owner.getPixiObj().visible = false;
            });
        }
    }

    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text = "Level " + (this.model.currentLevel + 1);
    }
}