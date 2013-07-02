/*global define*/

define([
	'mvc/Model',
	'mvc/Util'
], function(Model,Util) {
	'use strict';

	var DEFAULTS = {
		'time': null,
		'h': null,
		'z': null,
		'e': null,
		'f': null
	};

	var cache = {};

  var _buildCache = function(time){
		// cache the array index for times existing in the timeseries
		if (time !== null) {
			for (var i = 0, len = time.length; i < len; i++) {
				cache[time[i]] = i;
			}
		}
  };

	var TimeSeries = function(options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));

		_buildCache(this.get('time'));
	};

	TimeSeries.prototype = Object.create(Model.prototype);

  TimeSeries.prototype.getChannelHValue = function(time){

		var index = cache[time];

		if (typeof(index) === 'undefined') {
			return null;
		}

		return this.get('h')[index];
  };

  TimeSeries.prototype.getChannelEValue = function(time){

		var index = cache[time];

		if (typeof(index) === 'undefined') {
			return null;
		}

		return this.get('e')[index];

  };

  TimeSeries.prototype.getChannelZValue = function(time){

		var index = cache[time];

		if (typeof(index) === 'undefined') {
			return null;
		}

		return this.get('z')[index];

  };

  TimeSeries.prototype.getChannelFValue = function(time){

		var index = cache[time];

		if (typeof(index) === 'undefined') {
			return null;
		}

		return this.get('f')[index];

  };


	return TimeSeries;

});
