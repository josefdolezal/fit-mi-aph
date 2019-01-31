import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";

export class GamerOverComponent extends SpaceImpactBaseComponent {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);

        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text = "Game Over!\nYour score: " + this.model.score;
    }
}