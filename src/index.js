
import "./css/main.css";

import model from './js/model/index.js';
import createMap from './js/createMap.js';

let jolieCarte = {
    init: createMap,
    model: model,
};

global.jolieCarte = jolieCarte;

export default jolieCarte;