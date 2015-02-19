'use strict';

var Collection = require('mvc/Collection'),
    Measurement = require('geomag/Measurement'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  'id': null,
  'set_number': null,
  'declination_valid': 'Y',
  'declination_shift': 0,
  'horizontal_intensity_valid': 'Y',
  'vertical_intensity_valid': 'Y',
  'annotation': null,
  'measurements': null,
  'absD': null,
  'absH': null,
  'absZ': null,
  'baseD': null,
  'baseH': null,
  'baseZ': null,
  'startD': null,
  'startH': null,
  'startZ': null,
  'endD': null,
  'endH': null,
  'endZ': null
};


/**
 * Constructor.
 *
 * @param  options {Object} observatory attributes.
 */
var Reading = function (options) {
  var _this,
      _initialize,

      _options;

  _this = Model(options);

  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    var measurements = _this.get('measurements'),
        data = null,
        i = null,
        len = null,
        onChangeHandler = null;

    _options = Util.extend({}, _DEFAULTS, options);

    if (measurements === null) {
      measurements = new Collection([
        new Measurement({type: Measurement.FIRST_MARK_UP}),
        new Measurement({type: Measurement.FIRST_MARK_DOWN}),
        new Measurement({type: Measurement.WEST_DOWN}),
        new Measurement({type: Measurement.EAST_DOWN}),
        new Measurement({type: Measurement.WEST_UP}),
        new Measurement({type: Measurement.EAST_UP}),
        new Measurement({type: Measurement.SECOND_MARK_UP}),
        new Measurement({type: Measurement.SECOND_MARK_DOWN}),
        new Measurement({type: Measurement.SOUTH_DOWN}),
        new Measurement({type: Measurement.NORTH_UP}),
        new Measurement({type: Measurement.SOUTH_UP}),
        new Measurement({type: Measurement.NORTH_DOWN})
      ]);

      _this.set({'measurements': measurements});
    }

    data = measurements.data();
    len = data.length;

    onChangeHandler = function (evt) {
      _this.trigger('change:measurement', evt);
    };

    for (i = 0; i < len; i++) {
      data[i].on('change', onChangeHandler);
    }
  };

  /**
   * Utility method to call a function on each measurement in this reading.
   *
   * @param callback {Function}
   *        function to call with each measurement.
   */
  _this.eachMeasurement = function (callback) {
    var measurements = _this.get('measurements').data(),
        i,
        len;
    for (i = 0, len = measurements.length; i < len; i++) {
      callback(measurements[i]);
    }
  };

  /**
   * Get the Measurements for this reading.
   *
   * @return a key:array of type:[measurements]
   *
   * This is needed for future enhancements where we will have multiple
   * measurements per type.  Use this call so we don't have to refactor
   * everything later.
   */
  _this.getMeasurements = function () {
    var measurements = _this.get('measurements'),
        r = {},
        data,
        m,
        type,
        i;

    if (measurements !== null) {
      data = measurements.data();

      for (i = 0; i < data.length; i++) {
        m = data[i];
        type = m.get('type');
        if (!r.hasOwnProperty(type)) {
          r[type] = [];
        }
        r[type].push(m);
      }
    }

    return r;
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = Reading;
