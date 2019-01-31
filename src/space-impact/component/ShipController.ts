import { KeyInputComponent, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SPACE, KEY_A, KEY_W, KEY_S, KEY_X, KEY_D } from '../../../ts/components/KeyInputComponent';
import { Messages } from '../config/Messages';
import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';
import { checkTime} from '../Utils';

/** Direction of ship movement */
enum Direction {
    Up,
    Down,
    Left,
    Right
}

/** Generic controller for ship movement */
export class ShipController extends SpaceImpactBaseComponent {
    /** Height of the app screen */
    private sceneHeight: number;
    /** Width of the app screen */
    private sceneWidth: number;
    /** Timestamp of last missile shot */
    private lastShot = 0;

    onInit() {
        super.onInit();

        let screen = this.owner.getScene().app.screen;

        this.sceneHeight = screen.height;
        this.sceneWidth = screen.width;
    }

    /** Moves the ship in given direction */
    move(direction: Direction, delta: number) {
        let pixiObj = this.owner.getPixiObj();
        let movement = this.model.shipSpeed * delta;
        let topPadding = 5;

        // Move the ship
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

        // Do not allow the ship to go off-screen
        pixiObj.position.x = Math.max(0, Math.min(this.sceneWidth - pixiObj.width, pixiObj.position.x));
        pixiObj.position.y = Math.max(topPadding + pixiObj.height / 2, Math.min(this.sceneHeight - pixiObj.height / 2, pixiObj.position.y));
    }

    /** Try to create new missile if it's not too soon after the previous */
    tryFire(absolute: number): boolean {
        if (!checkTime(this.lastShot, absolute, this.model.shootingRate))
            return false;
        
        this.lastShot = absolute;
        this.factory.createMissile(this.owner, this.model);
        this.sendMessage(Messages.MSG_SHIP_MISSILE_SHOT);

        return true;
    }
}

/** Generic ship keyboard controller */
class ShipKeyboardController extends ShipController {
    /** Keycode for movement left */
    private left: number;
    /** Keycode for movement right */
    private right: number;
    /** Keycode for movement up */
    private up: number;
    /** Keycode for movement down */
    private down: number;
    /** Keycode for shooting */
    private shoot: number;

    constructor(left: number, right: number, up: number, down: number, shoot: number) {
        super();
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
        this.shoot = shoot;
    }

    onUpdate(delta: number, absolute: number) {
        let cmp = this.scene.stage.findComponentByClass(KeyInputComponent.name);
        let cmpKey = <KeyInputComponent><any>cmp;

        // Check if pressed key is used for movement
        if (cmpKey.isKeyPressed(this.left))
            this.move(Direction.Left, delta);
        else if (cmpKey.isKeyPressed(this.right))
            this.move(Direction.Right, delta);
        else if (cmpKey.isKeyPressed(this.up))
            this.move(Direction.Up, delta);
        else if (cmpKey.isKeyPressed(this.down))
            this.move(Direction.Down, delta);

        // Check if pressed key is used for shooting
        if(cmpKey.isKeyPressed(this.shoot))
            this.tryFire(absolute)
    }
}

/** Standard arrow controls for ship */
export class ShipArrowInputController extends ShipKeyboardController {
    constructor() {
        super(KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SPACE);
    }
}

/** Standard 'gaming' controls for ship */
export class ShipKeysInputController extends ShipKeyboardController {
    constructor() {
        super(KEY_A, KEY_D, KEY_W, KEY_S, KEY_X);
    }
}