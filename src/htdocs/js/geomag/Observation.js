'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Reading = require('geomag/Reading'),
    Util = require('util/Util');


var _DEFAULTS = {
  'id': null,
  'begin': null,
  'end': null,
  'reviewer_user_id': null,
  'observer_user_id': null,
  'mark_id': null,
  'electronics_id': null,
  'theodolite_id': null,
  'pier_temperature': null,
  'elect_temperature': null,
  'flux_temperature': null,
  'proton_temperature': null,
  'outside_temperature':null,
  'reviewed': 'N',
  'annotation': null,
  'readings': null
};


/**
 * Construct a new Observation.
 *
 * @param option {Object}
 *        view options.
 * @param option.baselineCalculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 * @param option.reading {geomag.Reading}
 *        the reading to display.
 */
var Observation = function (options) {
  var _this,
      _initialize,

      _updateMeasurementTimes;

  _this = Model(Util.extend({}, _DEFAULTS, options));
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    if (_this.get('readings') === null) {
      _this.set({
        readings: Collection([
          Reading({set_number: 1}),
          Reading({set_number: 2}),
          Reading({set_number: 3}),
          Reading({set_number: 4})
        ])
      });
    }
    if (_this.get('begin') === null) {
      _this.set({
        begin: new Date().getTime()
      });
    }

    _this.on('change:begin', _updateMeasurementTimes);
  };


  _updateMeasurementTimes = function () {
    _this.eachMeasurement(function (measurement) {
      var mtime = measurement.get('time'),
          bdate = _this.get('begin');

      if (mtime === null || bdate === null) {
        return;
      }

      bdate -= bdate % 86400000; // Trim off the time
      mtime = mtime % 86400000; // Trim off the date

      measurement.set({time: bdate + mtime});
    });
  };


  /**
   * Utility method to call a function on each measurement on each reading
   * in this observation.
   *
   * @param callback {Function}
   *        function to call with each measurement.
   */
  _this.eachMeasurement = function (callback) {
    _this.eachReading(function (reading) {
      reading.eachMeasurement(callback);
    });
  };

  /**
   * Utility method to call a function on each reading in this observation.
   *
   * @param callback {Function}
   *        function to call with each reading.
   */
  _this.eachReading = function (callback) {
    var readings = _this.get('readings').data(),
        i,
        len;

    for (i = 0, len = readings.length; i < len; i++) {
      callback(readings[i]);
    }
  };

  _initialize();
  options = null;
  return _this;
};

module.exports =  Observation;
