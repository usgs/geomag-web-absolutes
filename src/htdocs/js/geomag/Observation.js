/* global define */
define([
  'mvc/Collection',
  'mvc/Model',
  'util/Util',

  'geomag/Reading'
], function (
  Collection,
  Model,
  Util,

  Reading
) {
  'use strict';

  var DEFAULTS = {
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
    'reviewed': 'N',
    'annotation': null,
    'readings': null
  };

  var Observation = function (attributes) {
    Model.call(this, Util.extend({}, DEFAULTS, attributes));
    if (this.get('readings') === null) {
      this.set({
        readings: new Collection([
            new Reading({set_number: 1}),
            new Reading({set_number: 2}),
            new Reading({set_number: 3}),
            new Reading({set_number: 4})
            ])
      });
    }
    if (this.get('begin') === null) {
      this.set({
        begin: new Date().getTime()
      });
    }
  };
  Observation.prototype = Object.create(Model.prototype);


  /**
   * Utility method to call a function on each reading in this observation.
   *
   * @param callback {Function}
   *        function to call with each reading.
   */
  Observation.prototype.eachReading = function (callback) {
    var readings = this.get('readings').data(),
        i,
        len;
    for (i = 0, len = readings.length; i < len; i++) {
      callback(readings[i]);
    }
  };

  /**
   * Utility method to call a function on each measurement on each reading
   * in this observation.
   *
   * @param callback {Function}
   *        function to call with each measurement.
   */
  Observation.prototype.eachMeasurement = function (callback) {
    this.eachReading(function (reading) {
      reading.eachMeasurement(callback);
    });
  };


  return Observation;
});
