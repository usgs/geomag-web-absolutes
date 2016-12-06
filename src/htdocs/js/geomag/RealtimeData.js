'use strict';

var Collection = require('mvc/Collection'),
    Formatter = require('geomag/Formatter');


/**
 * A wrapper around realtime data.
 *
 * @param data {Object} realtime data object.
 */
var RealtimeData = function (options) {
  var _this,
      _initialize,

      _data,
      _times;


  _this = {};

  _initialize = function (options) {
    _times = options.times;
    _data = Collection(options.values);
  };

  _this.getStarttime = function () {
    return _times[0];
  };

  _this.getEndtime = function () {
    return _times[_times.length - 1];
  };

  /**
   * Get realtime data values for one observatory.
   *
   * @param timeMs {Number}
   *        millisecond epoch timestamp (as in Date.getTime()).
   * @return {Object} keys are channels, values are channel values at
   *         the second nearest to timeMs.  If time not in range, returns null.
   */
  _this.getValues = function (timeMs) {
    var time,
        timeIndex,
        channels,
        r = null;

    time = Formatter.dateTimeIso(timeMs);
    timeIndex = _times.indexOf(time);
    if (timeIndex !== -1) {
      r = {};
      channels = _data.data();
      for (var i = 0, len = channels.length; i < len; i++) {
        r[channels[i].id] = channels[i].values[timeIndex];
      }
    }

    return r;
  };

  _this.destroy = function () {
    // Clean up private variables
    _data = null;
    _times = null;
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = RealtimeData;
