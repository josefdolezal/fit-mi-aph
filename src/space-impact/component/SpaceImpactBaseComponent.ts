import { Attributes } from '../config/Attributes';
import { SpaceImpactModel } from '../SpaceImpactModel';
import Component from '../../../ts/engine/Component';
import SpaceImpactFactory from '../factory/SpaceImpactFactory';

/** Base component for all game components */
export default class SpaceImpactBaseComponent extends Component {
    /** Game model */
    model: SpaceImpactModel;
    /** Game objects factory */
    factory: SpaceImpactFactory;

    onInit() {
        this.model = this.scene.getGlobalAttribute<SpaceImpactModel>(Attributes.ATTR_MODEL);
        this.factory = this.scene.getGlobalAttribute<SpaceImpactFactory>(Attributes.ATTR_FACTORY);
    }
}
