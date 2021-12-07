import Zoom from 'ol/control/Zoom';

/**
 * Contrôle de zoom personnalisé
 *
 * @extends {ol.control.Zoom}
 *
 * @alias jolieCarte.control.ZoomControl
 * @memberof jolieCarte.control
 */
class ZoomControl extends Zoom {

    /**
     * @param {Object} opt_options
     */
    constructor(opt_options) {

        const options = opt_options ? opt_options : {};

        super(options);
    }
}

export default ZoomControl;