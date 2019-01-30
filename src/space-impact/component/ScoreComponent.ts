import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';

export class ScoreComponent extends SpaceImpactBaseComponent {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text =  ('000000' + this.model.score).slice(-6);
    }
}