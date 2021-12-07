import ol from 'ol';

import Viewer from '../model/Viewer';
import ZoomControl from '../control/ZoomControl';

/**
 * @param {HTMLElement} element
 * @param {object} options
 */
function map1(element, options) {
  options = $.extend({}, options);

  var viewer = new Viewer(element, options);

  var layers = [new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  })];

  var controls = [new ZoomControl()];

  viewer.addControls(controls);
  viewer.addLayers(layers);

}

export default map1;