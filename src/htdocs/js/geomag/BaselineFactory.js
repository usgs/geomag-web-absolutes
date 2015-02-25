'use strict';


var Events = require('util/Events'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');

var __no_op = function () {};


var _DEFAULTS = {
  dataUrl: 'baseline_data.php?observatoryId={observatoryId}&startTime={startTime}&endTime={endTime}',
};


var BaselineFactory = function (params) {
  var _this,
      _initialize,

      _dataUrl;


  _this = Events();

  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    _dataUrl = params.dataUrl;
  };


  _this.fetch = function (params) {
    var url;

    if (!params.hasOwnProperty('observatoryId') ||
        !params.hasOwnProperty('startTime') ||
        !params.hasOwnProperty('endTime')) {
      throw new Error('Must specify observatoryId, starttime, and endtime ' +
          'in order to fetch baseline data.');
    }

    url = _dataUrl.replace('{observatoryId}', params.observatoryId)
        .replace('{startTime}', params.startTime)
        .replace('{endTime}', params.endTime);

    Xhr.ajax({
      url: url,
      success: function (data) {
        // Execute the callback
        if (params.success && params.success.apply) {
          params.success(data);
        }

        // Notify passive listeners
        _this.trigger('data', data);
      },

      error: params.error || __no_op
    });
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = BaselineFactory;
