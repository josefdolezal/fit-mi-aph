import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';

/** Component managing game introductiona and running the game itself */
export class IntroComponent extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        // Keep the intro for 2 seconds, then run the game
        this.owner.getScene().invokeWithDelay(2000, () => {
            let rootObject = this.scene.stage;

            this.owner.remove();
            this.factory.startGame(rootObject, this.model);
        });
    }
}