/**
 * Openlayers
 * @external ol
 * @description Pluggin Openlayers
 * @see {@link https://openlayers.org/en/v6.9.0/apidoc/}
 */

/**
 * JQuery
 * @external jQuery
 * @description Pluggin JQuery
 * @see {@link http://api.jquery.com/}
 */
import $ from 'jquery';


import Map from 'ol/Map';
import View from 'ol/View';
import * as olProj from 'ol/proj';


/**
 * Visualiseur cartographique de l'application géoportail de l'urbanisme.
 * Encapsule la carte et ses contrôles.
 *
 * @alias jolieCarte.Viewer
 * @memberof jolieCarte
 */
class Viewer {

    /**
     * @param {HTMLElement} element
     * @param {Object} [opt_options] - Options
     * @param {string} [opt_options.dataProjection="EPSG:4326"] - Projection des données
     * @param {string} [opt_options.mapProjection="EPSG:3857"] - Projection de la carte
     */
    constructor(element, opt_options) {

        const options = opt_options ? opt_options : {};

        this.targetElement = $(element).addClass("jc-viewer");
        this.element = element;

        this.dataProjection = options.dataProjection || "EPSG:4326";
        this.mapProjection = options.mapProjection || "EPSG:3857";

        this.createMap(options);
    }


    /**
     * @description Création de la carte
     *
     * @param {Object} options
     *
     * @private
     */
    createMap(options) {
        options = options || {};
        this.mapElement = $('<div class="jolie-carte"></div>');
        this.mapElement.appendTo(this.targetElement);

        var center = olProj.transform([2.424722, 46.763056], this.dataProjection, this.mapProjection);
        var zoom = 6;
        var minZoomAllowed = 5;
        var maxZoomAllowed = 19;

        this.map = new Map({
            target: this.mapElement.get(0),
            view: new View({
                center: center,
                zoom: zoom,
                minZoom: minZoomAllowed,
                maxZoom: maxZoomAllowed,
                projection: this.mapProjection
            }),
            interactions: options.mapInteractions,
            controls: [],
            logo: false
        });
    }

    /**
     * @description Ajout d'un contrôle à la carte
     *
     * @param {ol.control.Control} control - Contrôle openlayers
     */
    addControl(control) {
        this.map.addControl(control);
    }

    /**
     * @description Ajout de plusieurs contrôles à la carte
     *
     * @param {ol.control.Control[]} controls - liste de Contrôles openlayers
     */
    addControls(controls) {
        for (var i in controls) {
            this.addControl(controls[i]);
        }
    }

    /**
     * @description Ajout d'une couche
     *
     * @param {ol.layer.Layer} layer
     */
    addLayer(layer) {
        this.map.addLayer(layer);
    }

    /**
     * @description Ajout de plusieurs couches
     *
     * @param {ol.layer.Layer[]} layers
     */
    addLayers(layers) {
        for (var i in layers) {
            this.addLayer(layers[i]);
        }
    }

    /**
     * @description Récupération de la carte
     *
     * @return {ol.Map}
     */
    getMap() {
        return this.map;
    }

    /**
     * @description Récupération de la div de la carte
     *
     * @return {HTMLElement}
     */
    getMapElement() {
        return this.mapElement;
    }

    /**
     * @description Récupère l'identifiant de l'emplacement cible de la vue
     *
     * @return {HTMLElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * @description Récupère l'élément jQuery de l'emplacement cible de la vue
     *
     * @return {external:jQuery}
     */
    getTargetElement() {
        return this.targetElement;
    }

    /**
     * @description Récupère la projection de la carte
     *
     * @return {string}
     */
    getMapProjection() {
        return this.mapProjection;
    }

    /**
     * @description Récupère la projection des données
     *
     * @return {string}
     */
    getDataProjection() {
        return this.dataProjection;
    }
}

export default Viewer;
