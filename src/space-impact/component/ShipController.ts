import { KeyInputComponent, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SPACE,  } from '../../../ts/components/KeyInputComponent';
import { Attributes } from '../config/Attributes';
import { Messages } from '../config/Messages';
import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';
import { checkTime} from '../Utils';

enum Direction {
    Up,
    Down,
    Left,
    Right
}

/**
 * Controller for the cannon
 */
export class ShipController extends SpaceImpactBaseComponent {

    private sceneHeight: number;
    private sceneWidth: number;

    private lastShot = 0;

    onInit() {
        super.onInit();

        let screen = this.owner.getScene().app.screen;

        this.sceneHeight = screen.height;
        this.sceneWidth = screen.width;
    }

    move(direction: Direction, delta: number) {
        let pixiObj = this.owner.getPixiObj();
        let movement = this.model.shipSpeed * delta;
        let topPadding = 5;

        switch(direction) {
            case Direction.Up:
                pixiObj.position.y -= movement;
                break;
            case Direction.Down:
                pixiObj.position.y += movement;
                break;
            case Direction.Left:
                pixiObj.position.x -= movement;
                break;
            case Direction.Right:
                pixiObj.position.x += movement;
                break;
        }

        // check boundaries
        pixiObj.position.x = Math.max(0, Math.min(this.sceneWidth - pixiObj.width, pixiObj.position.x));
        pixiObj.position.y = Math.max(topPadding + pixiObj.height / 2, Math.min(this.sceneHeight - pixiObj.height / 2, pixiObj.position.y));
    }

    tryFire(absolute: number): boolean {
        if (!checkTime(this.lastShot, absolute, this.model.shootingRate))
            return false;
        
        this.lastShot = absolute;
        this.factory.createMissile(this.owner, this.model);
        this.sendMessage(Messages.MSG_SHIP_MISSILE_SHOT);

        return true;
    }
}

/**
 * Cannon controller for the keyboard
 */
export class ShipArrowInputController extends ShipController {
    onUpdate(delta: number, absolute: number) {
        let cmp = this.scene.stage.findComponentByClass(KeyInputComponent.name);
        let cmpKey = <KeyInputComponent><any>cmp;

        if (cmpKey.isKeyPressed(KEY_LEFT))
            this.move(Direction.Left, delta);
        else if (cmpKey.isKeyPressed(KEY_RIGHT))
            this.move(Direction.Right, delta);
        else if (cmpKey.isKeyPressed(KEY_UP))
            this.move(Direction.Up, delta);
        else if (cmpKey.isKeyPressed(KEY_DOWN))
            this.move(Direction.Down, delta);

        if(cmpKey.isKeyPressed(KEY_SPACE))
            this.tryFire(absolute)
    }
}