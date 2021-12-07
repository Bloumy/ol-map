import ol from 'ol';

/**
 * Contrôle de zoom personnalisé
 *
 * @extends {ol.control.Zoom}
 *
 * @alias jolieCarte.control.ZoomControl
 * @memberof jolieCarte.control
 */
class ZoomControl extends ol.control.Zoom {

    /**
     * @param {Object} opt_options
     */
    constructor(opt_options) {

        const options = opt_options ? opt_options : {};

        super(options);
    }
}

export default ZoomControl;