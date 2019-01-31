import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";
import { Messages } from "../config/Messages";
import { Flags } from "../config/Flags";

/** Handles whether the second player is enabled by watch keyboard inputs */
export class MultiplayerComponent extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        // Run only when user end the key press
        document.addEventListener("keyup", ({keyCode}) => {
            // Look for key 'M'
            if(keyCode != 77) {
                return;
            }

            // If it's enabled, disable (and vice-versa)
            if(this.model.multiplayerEnabled) {
                this.model.multiplayerEnabled = false;
                
                // Remove secondary user's ship
                this.owner.getScene()
                    .findAllObjectsByFlag(Flags.FLAG_SECOND_PLAYER)
                    .forEach(o => o.remove());
            } else {
                // Create secondary ship
                this.model.multiplayerEnabled = true;
                this.factory.createShip(true, this.owner, this.model);
            }
        });
    }
}