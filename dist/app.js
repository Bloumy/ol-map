/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 893:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: external "$"
const external_$_namespaceObject = $;
var external_$_default = /*#__PURE__*/__webpack_require__.n(external_$_namespaceObject);
;// CONCATENATED MODULE: external "ol"
const external_ol_namespaceObject = ol;
var external_ol_default = /*#__PURE__*/__webpack_require__.n(external_ol_namespaceObject);
;// CONCATENATED MODULE: ./src/js/model/Viewer.js
/**
 * JQuery
 * @external jQuery
 * @description Pluggin JQuery
 * @see {@link http://api.jquery.com/}
 */


/**
 * Openlayers
 * @external ol
 * @description Pluggin Openlayers
 * @see {@link https://openlayers.org/en/v6.9.0/apidoc/}
 */



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

        this.targetElement = external_$_default()(element).addClass("jc-viewer");
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
        this.mapElement = external_$_default()('<div class="jolie-carte"></div>');
        this.mapElement.appendTo(this.targetElement);

        var center = external_ol_default().proj.transform([2.424722, 46.763056], this.dataProjection, this.mapProjection);
        var zoom = 6;
        var minZoomAllowed = 5;
        var maxZoomAllowed = 19;

        this.map = new (external_ol_default()).Map({
            target: this.mapElement.get(0),
            view: new (external_ol_default()).View({
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

/* harmony default export */ const model_Viewer = (Viewer);

;// CONCATENATED MODULE: ./src/js/model/index.js


/**
 * Liste des classes modèles
 *
 * @namespace jolieCarte.model
 * @memberof jolieCarte
 */
/* harmony default export */ const model = ({
    Viewer: model_Viewer
});
;// CONCATENATED MODULE: ./src/js/control/ZoomControl.js


/**
 * Contrôle de zoom personnalisé
 *
 * @extends {ol.control.Zoom}
 *
 * @alias jolieCarte.control.ZoomControl
 * @memberof jolieCarte.control
 */
class ZoomControl extends (external_ol_default()).control.Zoom {

    /**
     * @param {Object} opt_options
     */
    constructor(opt_options) {

        const options = opt_options ? opt_options : {};

        super(options);
    }
}

/* harmony default export */ const control_ZoomControl = (ZoomControl);
;// CONCATENATED MODULE: ./src/js/customMaps/map1.js





/**
 * @param {HTMLElement} element
 * @param {object} options
 */
function map1(element, options) {
  options = $.extend({}, options);

  var viewer = new model_Viewer(element, options);

  var layers = [new (external_ol_default()).layer.Tile({
    source: new (external_ol_default()).source.XYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  })];

  var controls = [new control_ZoomControl()];

  viewer.addControls(controls);
  viewer.addLayers(layers);

}

/* harmony default export */ const customMaps_map1 = (map1);
;// CONCATENATED MODULE: ./src/js/customMaps/index.js


/**
 * Liste des cartes disponibles
 *
 * @namespace jolieCarte.customMaps
 * @memberof jolieCarte
 */
/* harmony default export */ const customMaps = ({
    map1: customMaps_map1
});
;// CONCATENATED MODULE: ./src/js/control/index.js


/**
 * Liste des controles personnalisés
 *
 * @namespace jolieCarte.control
 * @memberof jolieCarte
 */
/* harmony default export */ const control = ({
    ZoomControl: control_ZoomControl
});
;// CONCATENATED MODULE: ./src/index.js







let jolieCarte = {
    customMaps: customMaps,
    model: model,
    control: control
};

__webpack_require__.g.jolieCarte = jolieCarte;

/* harmony default export */ const src = (jolieCarte);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// Webpack Polyfill Injector
function main() {
    __webpack_require__(893);
}
if (function() {
    return /* Element.prototype.classList */ !("document"in self&&"classList"in document.documentElement&&"Element"in self&&"classList"in Element.prototype&&function(){var e=document.createElement("span")
return e.classList.add("a","b"),e.classList.contains("b")}()
) ||
        /* requestAnimationFrame */ !("requestAnimationFrame"in self
);
}.call(window)) {
    var js = document.createElement('script');
    js.src = "autopolyfill.js";
    js.onload = main;
    js.onerror = function onError(message) {
        console.error('Could not load the polyfills: ' + message);
    };
    document.head.appendChild(js);
} else {
    main();
}
})();

/******/ })()
;