
import 'ol/ol.css';
import "./css/main.css";

import model from './js/model/index.js';
import customMaps from './js/customMaps/index.js';
import control from "./js/control/index.js";

let jolieCarte = {
    customMaps: customMaps,
    model: model,
    control: control
};

global.jolieCarte = jolieCarte;

export default jolieCarte;