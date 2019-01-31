import { Messages } from '../config/Messages';
import { Resources } from '../config/Resources';
import { GenericComponent } from '../../../ts/components/GenericComponent';

/**
 * Sound handler
 */
export class SoundComponent extends GenericComponent {

    constructor(){
        super(SoundComponent.name);

        this.doOnMessage(Messages.MSG_SHIP_MISSILE_SHOT, (cmp, msg) => (<any>PIXI.loader.resources[Resources.SOUND_SHIP_SHOT]).sound.play());
        this.doOnMessage(Messages.MSG_ENEMY_MISSILE_SHOT, (cmp, msg) => (<any>PIXI.loader.resources[Resources.SOUND_ENEMY_SHOT]).sound.play());
        this.doOnMessage(Messages.MSG_ENEMY_KILLED, (cmp, msg) => (<any>PIXI.loader.resources[Resources.SOUND_EXPLOSION]).sound.play());
        this.doOnMessage(Messages.MSG_SHIP_KILLED, (cmp, msg) => (<any>PIXI.loader.resources[Resources.SOUND_EXPLOSION]).sound.play());
        this.doOnMessage(Messages.MSG_GAME_OVER, (cmp, msg) => (<any>PIXI.loader.resources[Resources.SOUND_GAME_OVER]).sound.play());
    }
}