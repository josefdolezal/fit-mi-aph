import Component from '../engine/Component';

export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_X = 88;
export const KEY_U = 85;
export const KEY_I = 73;
export const KEY_W = 87;
export const KEY_A = 65;
export const KEY_S = 83;
export const KEY_D = 68;
export const KEY_SPACE = 32;

/**
 * Component for key-input handling
 */
export class KeyInputComponent extends Component {

    private keys = new Set<number>();

    onInit() {
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    }

    onRemove() {
        document.removeEventListener("keyup", this.onKeyUp.bind(this));
        document.removeEventListener("keydown", this.onKeyDown.bind(this));
    }

    isKeyPressed(keyCode: number) {
        return this.keys.has(keyCode);
    }

    private onKeyDown(evt: KeyboardEvent) {
        this.keys.add(evt.keyCode);
    }

    private onKeyUp(evt) {
        this.keys.delete(evt.keyCode);
    }
}