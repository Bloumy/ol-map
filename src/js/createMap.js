import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import Viewer from './model/Viewer';


/**
 * @param {HTMLElement} element
 * @param {object} options
 */
 function createMap(element, options){
    options = $.extend({},options);

   var viewer = new Viewer(element, options);

   viewer.addLayer(new TileLayer({
    source: new XYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  }));

}

export default createMap;