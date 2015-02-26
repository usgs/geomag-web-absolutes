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
      _initialize;

  _this = Model(Util.extend({}, _DEFAULTS, options));

  /**
   * Initialize view, and call render.
   */
  _initialize = function () {
    var data = null,
        i = null,
        len = null,
        measurements = _this.get('measurements'),
        onChangeHandler = null;

    if (measurements === null) {
      measurements = Collection([
        Measurement({type: Measurement.FIRST_MARK_UP}),
        Measurement({type: Measurement.FIRST_MARK_DOWN}),
        Measurement({type: Measurement.WEST_DOWN}),
        Measurement({type: Measurement.EAST_DOWN}),
        Measurement({type: Measurement.WEST_UP}),
        Measurement({type: Measurement.EAST_UP}),
        Measurement({type: Measurement.SECOND_MARK_UP}),
        Measurement({type: Measurement.SECOND_MARK_DOWN}),
        Measurement({type: Measurement.SOUTH_DOWN}),
        Measurement({type: Measurement.NORTH_UP}),
        Measurement({type: Measurement.SOUTH_UP}),
        Measurement({type: Measurement.NORTH_DOWN})
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
    var i,
        len,
        measurements = _this.get('measurements').data();

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
    var data,
        i,
        m,
        measurements = _this.get('measurements'),
        r = {},
        type;

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

  _initialize();
  options = null;
  return _this;
};

module.exports = Reading;
