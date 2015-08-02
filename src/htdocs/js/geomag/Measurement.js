'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  'id': null,
  'type': null,
  'time': null,
  'angle': 0,
  'h': null,
  'e': null,
  'z': null,
  'f': null,
  'time_error':null,
  'angle_error':null
};


/**
 * Constructor.
 *
 * @param options {Object} Measurement attributes.
 * @param options.id {int}
 * @param options.type {string}
 * @param options.time {epoch time}
 * @param options.angle {float}
 * @param options.h {float}
 * @param options.e {float}
 * @param options.z {float}
 * @param options.f {float}
 **/
var Measurement = function (options) {
  var _this,

      _options;

  _options = Util.extend({}, _DEFAULTS, options);
  _this = Model(_options);

  /**
   * Set realtime data values corresponding to measurement time.
   *
   * @param realtimeData {RealtimeData}
   *        as returned by RealtimeDataFactory.
   */
  _this.setRealtimeData = function (realtimeData) {
    var values = realtimeData.getValues(_this.get('time')),
        toset;
    toset = {
      h: null,
      e: null,
      z: null,
      f: null
    };
    if (values !== null) {
      toset.h = values.H;
      toset.e = values.E;
      toset.z = values.Z;
      toset.f = values.F;
    }
    _this.set(toset);
  };

  _this.getErrors = function () {
    var errors = [];

    if (_this.get('time_error') !== null) {
      errors.push(_this.get('time_error'));
    }

    if (_this.get('angle_error') !== null) {
      errors.push(_this.get('angle_error'));
    }

    return errors;
  };


  options = null;
  return _this;
};

// These are in the same order as appear on the paper form.
Measurement.FIRST_MARK_UP = 'FirstMarkUp';
Measurement.FIRST_MARK_DOWN = 'FirstMarkDown';
Measurement.WEST_DOWN = 'WestDown';
Measurement.EAST_DOWN = 'EastDown';
Measurement.WEST_UP = 'WestUp';
Measurement.EAST_UP = 'EastUp';
Measurement.SECOND_MARK_UP = 'SecondMarkUp';
Measurement.SECOND_MARK_DOWN = 'SecondMarkDown';
Measurement.SOUTH_DOWN = 'SouthDown';
Measurement.NORTH_UP = 'NorthUp';
Measurement.SOUTH_UP = 'SouthUp';
Measurement.NORTH_DOWN = 'NorthDown';

module.exports = Measurement;
