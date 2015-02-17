'use strict';

var Model = require('mvc/Model'),
    RealtimeData = require('geomag/RealtimeData'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULT_URL = '/map/observatories_data.json.php';

var _DEFAULTS = {
  'url': _DEFAULT_URL,
  'starttime': null,
  'endtime': null,
  'channels': ['H','E','Z','F'],
  'freq': 'seconds'
};


/**
 * Constructor.
 *
 * @param options {Object} observatory attributes.
 * @param options.url {string}
 * @param options.channels {Array<string>}
 * @param options.observatory {Array{string}}
 * @param options.freq {string{seconds|minutes}}
 * @param options.success {callback()}
 */
var RealtimeDataFactory = function (options) {
  var _this,
      _initialize,

      _options;

    _this = Model(options);

    _options = Util.extend({}, _DEFAULTS, options);

    // TODO: this is a hack to deal with
    // https://github.com/usgs/hazdev-webutils/issues/8
    _this._lastcall = null;

  /**
   * @param options {Object} observatory attributes.
   *        options.???  Same as constructor.
   */
  _this.getRealtimeData = function (options) {
    _options = Util.extend({}, this.get(), options);

    // TODO: this is a hack to deal with
    // https://github.com/usgs/hazdev-webutils/issues/8
    if (_this._lastcall !== null) {
      while (_this._lastcall === new Date().getTime()) {
        // wait until its not
      }
    }
    _this._lastcall = new Date().getTime();

    Xhr.jsonp({
      url: options.url,
      data: {
        'starttime': options.starttime,
        'endtime': options.endtime,
        'obs[]': options.observatory,
        'chan[]': options.channels,
        'freq': options.freq
      },
      success: function (data) {
        options.success(new RealtimeData(data));
      }
    });
  };

  return _this;
};

module.exports = RealtimeDataFactory;

