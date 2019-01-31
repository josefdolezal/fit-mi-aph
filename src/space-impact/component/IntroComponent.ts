import SpaceImpactBaseComponent from './SpaceImpactBaseComponent';

export class IntroComponent extends SpaceImpactBaseComponent {
    onInit() {
        super.onInit();

        this.owner.getScene().invokeWithDelay(2000, () => {
            let rootObject = this.scene.stage;

            this.owner.remove();
            this.factory.startGame(rootObject, this.model);
        });
    }
}