/**
 * @module ol/source/TileWMS
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { DEFAULT_WMS_VERSION } from './common.js';
import TileImage from './TileImage.js';
import WMSServerType from './WMSServerType.js';
import { appendParams } from '../uri.js';
import { assert } from '../asserts.js';
import { assign } from '../obj.js';
import { buffer, createEmpty } from '../extent.js';
import { buffer as bufferSize, scale as scaleSize, toSize } from '../size.js';
import { calculateSourceResolution } from '../reproj.js';
import { compareVersions } from '../string.js';
import { get as getProjection, transform, transformExtent } from '../proj.js';
import { modulo } from '../math.js';
import { hash as tileCoordHash } from '../tilecoord.js';
/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [imageSmoothing=true] Enable image smoothing.
 * @property {Object<string,*>} params WMS request parameters.
 * At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @property {number} [gutter=0]
 * The size in pixels of the gutter around image tiles to ignore. By setting
 * this property to a non-zero value, images will be requested that are wider
 * and taller than the tile size by a value of `2 x gutter`.
 * Using a non-zero value allows artifacts of rendering at tile edges to be
 * ignored. If you control the WMS service it is recommended to address
 * "artifacts at tile edges" issues by properly configuring the WMS service. For
 * example, MapServer has a `tile_map_edge_buffer` configuration parameter for
 * this. See https://mapserver.org/output/tile_mode.html.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {typeof import("../ImageTile.js").default} [tileClass] Class used to instantiate image tiles.
 * Default is {@link module:ol/ImageTile~ImageTile}.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid. Base this on the resolutions,
 * tilesize and extent supported by the server.
 * If this is not defined, a default grid will be used: if there is a projection
 * extent, the grid will be based on that; if not, a grid based on a global
 * extent with origin at 0,0 will be used..
 * @property {import("./WMSServerType.js").default|string} [serverType]
 * The type of the remote WMS server. Currently only used when `hidpi` is
 * `true`.
 * @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] WMS service URL.
 * @property {Array<string>} [urls] WMS service urls.
 * Use this instead of `url` when the WMS supports multiple urls for GetMap requests.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * When set to `false`, only one world
 * will be rendered. When `true`, tiles will be requested for one world only,
 * but they will be wrapped horizontally to render multiple worlds.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 * @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
 * Choose whether to use tiles with a higher or lower zoom level when between integer
 * zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
 */
/**
 * @classdesc
 * Layer source for tile data from WMS servers.
 * @api
 */
var TileWMS = /** @class */ (function (_super) {
    __extends(TileWMS, _super);
    /**
     * @param {Options} [opt_options] Tile WMS options.
     */
    function TileWMS(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : /** @type {Options} */ ({});
        var params = options.params || {};
        var transparent = 'TRANSPARENT' in params ? params['TRANSPARENT'] : true;
        _this = _super.call(this, {
            attributions: options.attributions,
            attributionsCollapsible: options.attributionsCollapsible,
            cacheSize: options.cacheSize,
            crossOrigin: options.crossOrigin,
            imageSmoothing: options.imageSmoothing,
            opaque: !transparent,
            projection: options.projection,
            reprojectionErrorThreshold: options.reprojectionErrorThreshold,
            tileClass: options.tileClass,
            tileGrid: options.tileGrid,
            tileLoadFunction: options.tileLoadFunction,
            url: options.url,
            urls: options.urls,
            wrapX: options.wrapX !== undefined ? options.wrapX : true,
            transition: options.transition,
            zDirection: options.zDirection,
        }) || this;
        /**
         * @private
         * @type {number}
         */
        _this.gutter_ = options.gutter !== undefined ? options.gutter : 0;
        /**
         * @private
         * @type {!Object}
         */
        _this.params_ = params;
        /**
         * @private
         * @type {boolean}
         */
        _this.v13_ = true;
        /**
         * @private
         * @type {import("./WMSServerType.js").default|undefined}
         */
        _this.serverType_ =
            /** @type {import("./WMSServerType.js").default|undefined} */ (options.serverType);
        /**
         * @private
         * @type {boolean}
         */
        _this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;
        /**
         * @private
         * @type {import("../extent.js").Extent}
         */
        _this.tmpExtent_ = createEmpty();
        _this.updateV13_();
        _this.setKey(_this.getKeyForParams_());
        return _this;
    }
    /**
     * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
     * projection. Return `undefined` if the GetFeatureInfo URL cannot be
     * constructed.
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {number} resolution Resolution.
     * @param {import("../proj.js").ProjectionLike} projection Projection.
     * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
     *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
     *     in the `LAYERS` parameter will be used. `VERSION` should not be
     *     specified here.
     * @return {string|undefined} GetFeatureInfo URL.
     * @api
     */
    TileWMS.prototype.getFeatureInfoUrl = function (coordinate, resolution, projection, params) {
        var projectionObj = getProjection(projection);
        var sourceProjectionObj = this.getProjection();
        var tileGrid = this.getTileGrid();
        if (!tileGrid) {
            tileGrid = this.getTileGridForProjection(projectionObj);
        }
        var z = tileGrid.getZForResolution(resolution, this.zDirection);
        var tileCoord = tileGrid.getTileCoordForCoordAndZ(coordinate, z);
        if (tileGrid.getResolutions().length <= tileCoord[0]) {
            return undefined;
        }
        var tileResolution = tileGrid.getResolution(tileCoord[0]);
        var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
        var tileSize = toSize(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);
        var gutter = this.gutter_;
        if (gutter !== 0) {
            tileSize = bufferSize(tileSize, gutter, this.tmpSize);
            tileExtent = buffer(tileExtent, tileResolution * gutter, tileExtent);
        }
        if (sourceProjectionObj && sourceProjectionObj !== projectionObj) {
            tileResolution = calculateSourceResolution(sourceProjectionObj, projectionObj, coordinate, tileResolution);
            tileExtent = transformExtent(tileExtent, projectionObj, sourceProjectionObj);
            coordinate = transform(coordinate, projectionObj, sourceProjectionObj);
        }
        var baseParams = {
            'SERVICE': 'WMS',
            'VERSION': DEFAULT_WMS_VERSION,
            'REQUEST': 'GetFeatureInfo',
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'QUERY_LAYERS': this.params_['LAYERS'],
        };
        assign(baseParams, this.params_, params);
        var x = Math.floor((coordinate[0] - tileExtent[0]) / tileResolution);
        var y = Math.floor((tileExtent[3] - coordinate[1]) / tileResolution);
        baseParams[this.v13_ ? 'I' : 'X'] = x;
        baseParams[this.v13_ ? 'J' : 'Y'] = y;
        return this.getRequestUrl_(tileCoord, tileSize, tileExtent, 1, sourceProjectionObj || projectionObj, baseParams);
    };
    /**
     * Return the GetLegendGraphic URL, optionally optimized for the passed
     * resolution and possibly including any passed specific parameters. Returns
     * `undefined` if the GetLegendGraphic URL cannot be constructed.
     *
     * @param {number} [resolution] Resolution. If set to undefined, `SCALE`
     *     will not be calculated and included in URL.
     * @param {Object} [params] GetLegendGraphic params. If `LAYER` is set, the
     *     request is generated for this wms layer, else it will try to use the
     *     configured wms layer. Default `FORMAT` is `image/png`.
     *     `VERSION` should not be specified here.
     * @return {string|undefined} GetLegendGraphic URL.
     * @api
     */
    TileWMS.prototype.getLegendUrl = function (resolution, params) {
        if (this.urls[0] === undefined) {
            return undefined;
        }
        var baseParams = {
            'SERVICE': 'WMS',
            'VERSION': DEFAULT_WMS_VERSION,
            'REQUEST': 'GetLegendGraphic',
            'FORMAT': 'image/png',
        };
        if (params === undefined || params['LAYER'] === undefined) {
            var layers = this.params_.LAYERS;
            var isSingleLayer = !Array.isArray(layers) || layers.length === 1;
            if (!isSingleLayer) {
                return undefined;
            }
            baseParams['LAYER'] = layers;
        }
        if (resolution !== undefined) {
            var mpu = this.getProjection()
                ? this.getProjection().getMetersPerUnit()
                : 1;
            var pixelSize = 0.00028;
            baseParams['SCALE'] = (resolution * mpu) / pixelSize;
        }
        assign(baseParams, params);
        return appendParams(/** @type {string} */ (this.urls[0]), baseParams);
    };
    /**
     * @return {number} Gutter.
     */
    TileWMS.prototype.getGutter = function () {
        return this.gutter_;
    };
    /**
     * Get the user-provided params, i.e. those passed to the constructor through
     * the "params" option, and possibly updated using the updateParams method.
     * @return {Object} Params.
     * @api
     */
    TileWMS.prototype.getParams = function () {
        return this.params_;
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("../size.js").Size} tileSize Tile size.
     * @param {import("../extent.js").Extent} tileExtent Tile extent.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @param {Object} params Params.
     * @return {string|undefined} Request URL.
     * @private
     */
    TileWMS.prototype.getRequestUrl_ = function (tileCoord, tileSize, tileExtent, pixelRatio, projection, params) {
        var urls = this.urls;
        if (!urls) {
            return undefined;
        }
        params['WIDTH'] = tileSize[0];
        params['HEIGHT'] = tileSize[1];
        params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();
        if (!('STYLES' in this.params_)) {
            params['STYLES'] = '';
        }
        if (pixelRatio != 1) {
            switch (this.serverType_) {
                case WMSServerType.GEOSERVER:
                    var dpi = (90 * pixelRatio + 0.5) | 0;
                    if ('FORMAT_OPTIONS' in params) {
                        params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
                    }
                    else {
                        params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
                    }
                    break;
                case WMSServerType.MAPSERVER:
                    params['MAP_RESOLUTION'] = 90 * pixelRatio;
                    break;
                case WMSServerType.CARMENTA_SERVER:
                case WMSServerType.QGIS:
                    params['DPI'] = 90 * pixelRatio;
                    break;
                default:
                    assert(false, 52); // Unknown `serverType` configured
                    break;
            }
        }
        var axisOrientation = projection.getAxisOrientation();
        var bbox = tileExtent;
        if (this.v13_ && axisOrientation.substr(0, 2) == 'ne') {
            var tmp = void 0;
            tmp = tileExtent[0];
            bbox[0] = tileExtent[1];
            bbox[1] = tmp;
            tmp = tileExtent[2];
            bbox[2] = tileExtent[3];
            bbox[3] = tmp;
        }
        params['BBOX'] = bbox.join(',');
        var url;
        if (urls.length == 1) {
            url = urls[0];
        }
        else {
            var index = modulo(tileCoordHash(tileCoord), urls.length);
            url = urls[index];
        }
        return appendParams(url, params);
    };
    /**
     * Get the tile pixel ratio for this source.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Tile pixel ratio.
     */
    TileWMS.prototype.getTilePixelRatio = function (pixelRatio) {
        return !this.hidpi_ || this.serverType_ === undefined ? 1 : pixelRatio;
    };
    /**
     * @private
     * @return {string} The key for the current params.
     */
    TileWMS.prototype.getKeyForParams_ = function () {
        var i = 0;
        var res = [];
        for (var key in this.params_) {
            res[i++] = key + '-' + this.params_[key];
        }
        return res.join('/');
    };
    /**
     * Update the user-provided params.
     * @param {Object} params Params.
     * @api
     */
    TileWMS.prototype.updateParams = function (params) {
        assign(this.params_, params);
        this.updateV13_();
        this.setKey(this.getKeyForParams_());
    };
    /**
     * @private
     */
    TileWMS.prototype.updateV13_ = function () {
        var version = this.params_['VERSION'] || DEFAULT_WMS_VERSION;
        this.v13_ = compareVersions(version, '1.3') >= 0;
    };
    /**
     * @param {import("../tilecoord.js").TileCoord} tileCoord The tile coordinate
     * @param {number} pixelRatio The pixel ratio
     * @param {import("../proj/Projection.js").default} projection The projection
     * @return {string|undefined} The tile URL
     * @override
     */
    TileWMS.prototype.tileUrlFunction = function (tileCoord, pixelRatio, projection) {
        var tileGrid = this.getTileGrid();
        if (!tileGrid) {
            tileGrid = this.getTileGridForProjection(projection);
        }
        if (tileGrid.getResolutions().length <= tileCoord[0]) {
            return undefined;
        }
        if (pixelRatio != 1 && (!this.hidpi_ || this.serverType_ === undefined)) {
            pixelRatio = 1;
        }
        var tileResolution = tileGrid.getResolution(tileCoord[0]);
        var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
        var tileSize = toSize(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);
        var gutter = this.gutter_;
        if (gutter !== 0) {
            tileSize = bufferSize(tileSize, gutter, this.tmpSize);
            tileExtent = buffer(tileExtent, tileResolution * gutter, tileExtent);
        }
        if (pixelRatio != 1) {
            tileSize = scaleSize(tileSize, pixelRatio, this.tmpSize);
        }
        var baseParams = {
            'SERVICE': 'WMS',
            'VERSION': DEFAULT_WMS_VERSION,
            'REQUEST': 'GetMap',
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
        };
        assign(baseParams, this.params_);
        return this.getRequestUrl_(tileCoord, tileSize, tileExtent, pixelRatio, projection, baseParams);
    };
    return TileWMS;
}(TileImage));
export default TileWMS;
//# sourceMappingURL=TileWMS.js.map