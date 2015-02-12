/* global define */
define([
  'mvc/Collection'
], function (
  Collection
) {
  'use strict';


  /**
   * A wrapper around realtime data.
   *
   * @param data {Object} realtime data object.
   */
  var RealtimeData = function (data) {
    this._times = data.times;
    this._data = new Collection(data.data);
  };


  RealtimeData.prototype.getStarttime = function () {
    return this._times[0];
  };

  RealtimeData.prototype.getEndtime = function () {
    return this._times[this._times.length - 1];
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
  RealtimeData.prototype.getValues = function (timeMs, observatory) {
    var time,
        timeIndex,
        obj,
        channels,
        channel,
        r = null;

    time = Math.round(timeMs / 1000);
    timeIndex = this._times.indexOf(time);
    if (timeIndex !== -1) {
      // find correct observatory
      if (observatory) {
        obj = this._data.get(observatory);
        if (obj === null) {
          return null;
        } else {
          channels = obj.values;
        }
      } else {
        // default to first observatory
        channels = this._data.data()[0].values;
      }
      // extract values for time
      r = {};
      for (channel in channels) {
        r[channel] = channels[channel][timeIndex];
      }
    }

    return r;
  };


  // return constructor
  return RealtimeData;
});
