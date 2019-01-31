import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';

/** Manages current game score on screen */
export class ScoreComponent extends SpaceImpactBaseComponent {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        // Update the text on each loop call
        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text =  ('000000' + this.model.score).slice(-6);
    }
}