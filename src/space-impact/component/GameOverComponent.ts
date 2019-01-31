import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";

export class GamerOverComponent extends SpaceImpactBaseComponent {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);
        
        let description = this.model.lives <= 0 ? "Game Over!" : "You Won!";

        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text = description + "\nYour score: " + this.model.score;
    }
}