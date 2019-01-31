import { DynamicsComponent } from '../../../ts/components/DynamicsComponent';
import { Point } from 'pixi.js';

/** Linear movement for ship/user missile */
export class MissileComponent extends DynamicsComponent {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        // Remove missile if it's off-screen
        let globalPos = this.owner.getPixiObj().toGlobal(new Point(0, 0));
        if (globalPos.x > this.scene.app.screen.width)
            this.owner.remove();
    }
}