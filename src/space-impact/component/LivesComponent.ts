import SpaceImpactBaseComponent, {} from './SpaceImpactBaseComponent';
import { PIXICmp } from '../../../ts/engine/PIXIObject';
import { Tags } from '../config/Tags';
import { Resources } from '../config/Resources';

export class LivesComponent extends SpaceImpactBaseComponent {
    protected lives: PIXICmp.ComponentObject[] = []

    onInit() {
        super.onInit();

        let lives = this.model.maxLives;
        let owner = this.owner.getPixiObj();

        for (let i = 0; i < lives; ++i) {
            let sprite = new PIXICmp.Sprite(Tags.TAG_GROUND, PIXI.Texture.fromImage(Resources.TEXTURE_TAG_LIVE));

            sprite.position.x = i * sprite.width + i * 10;
            sprite.visible = false;

            this.lives.push(sprite);
            owner.addChild(sprite);            
        }
    }

    onUpdate(delta, absolute) {
        for(let i = 0; i < this.model.maxLives; ++i) {
            this.lives[i].getPixiObj().visible = i < this.model.lives;
        }
    }
}
