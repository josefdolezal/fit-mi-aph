import { Attributes } from '../config/Attributes';
import { SpaceImpactModel } from '../SpaceImpactModel';
import Component from '../../../ts/engine/Component';
import SpaceImpactFactory from '../factory/SpaceImpactFactory';

/**
 * Base component for all paratrooper components, keeps references
 * to model and factory
 */
export default class SpaceImpactBaseComponent extends Component {
    model: SpaceImpactModel;
    factory: SpaceImpactFactory;

    onInit() {
        this.model = this.scene.getGlobalAttribute<SpaceImpactModel>(Attributes.ATTR_MODEL);
        this.factory = this.scene.getGlobalAttribute<SpaceImpactFactory>(Attributes.ATTR_FACTORY);
    }
}
