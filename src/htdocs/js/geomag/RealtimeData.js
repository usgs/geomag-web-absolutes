'use strict';

var Collection = require('mvc/Collection');


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
    _data = Collection(options.data);
  };

  _this.getStarttime = function () {
    return _times[0];
  };

  _this.getEndtime = function () {
    return _times[_times.length - 1];
  };

  /**
   * Get realtime data values.
   *
   * @param timeMs {Number}
   *        millisecond epoch timestamp (as in Date.getTime()).
   * @param observatory {String}
   *        observatory code.
   *        optional, default is first observatory in list.
   * @return {Object} keys are channels, values are channel values at
   *         the second nearest to timeMs.  If time not in range, returns null.
   */
  _this.getValues = function (timeMs, observatory) {
    var time,
        timeIndex,
        obj,
        channels,
        channel,
        r = null;

    time = Math.round(timeMs / 1000);
    timeIndex = _times.indexOf(time);
    if (timeIndex !== -1) {
      // find correct observatory
      if (observatory) {
        obj = _data.get(observatory);
        if (obj === null) {
          return null;
        } else {
          channels = obj.values;
        }
      } else {
        // default to first observatory
        channels = _data.data()[0].values;
      }
      // extract values for time
      r = {};
      for (channel in channels) {
        r[channel] = channels[channel][timeIndex];
      }
    }

    return r;
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = RealtimeData;
