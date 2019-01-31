import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Messages } from "../config/Messages";
import { Flags } from "../config/Flags";

export class MultiplayerComponent extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        document.addEventListener("keyup", ({keyCode}) => {
            if(keyCode != 77) {
                return;
            }

            if(this.model.multiplayerEnabled) {
                this.model.multiplayerEnabled = false;
                
                this.owner.getScene()
                    .findAllObjectsByFlag(Flags.FLAG_SECOND_PLAYER)
                    .forEach(o => o.remove());
            } else {
                this.model.multiplayerEnabled = true;
                this.factory.createShip(true, this.owner, this.model);
            }
        });
    }
}