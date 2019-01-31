import SpaceImpactBaseComponent from "./SpaceImpactBaseComponent";

/** Handles game over/won information on screen */
export class GamerOverComponent extends SpaceImpactBaseComponent {
    onUpdate(delta, absolute) {
        super.onUpdate(delta, absolute);
        
        // Determine the text based on lives
        let description = this.model.lives <= 0 ? "Game Over!" : "You Won!";

        let text = <PIXI.Text>this.owner.getPixiObj();
        text.text = description + "\nYour score: " + this.model.score;
    }
}