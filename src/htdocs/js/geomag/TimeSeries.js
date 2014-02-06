/*global define*/

define([
	'mvc/Model',
	'util/Util'
], function(Model,Util) {
	'use strict';

	var DEFAULTS = {
		'time': null,
		'h': null,
		'z': null,
		'e': null,
		'f': null
	};

	var _buildCache = function(time){

		var cache = {};
		// cache the array index for times existing in the timeseries
		if (time !== null) {
			for (var i = 0, len = time.length; i < len; i++) {
				cache[time[i]] = i;
			}
		}

		return cache;
	};

	var TimeSeries = function(options) {

		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));

		// build cache object
		this.cache = _buildCache(this.get('time'));
	};

	TimeSeries.prototype = Object.create(Model.prototype);

	TimeSeries.prototype.getChannelValueByTime = function(time, channel) {

		var index = this.cache[time];

		if (typeof(index) === 'undefined') {
			return null;
		}

		if (channel === 'h') {

			return this.getChannelHValue(index);

		} else if (channel === 'e') {

			return this.getChannelEValue(index);

		} else if (channel === 'z') {

			return this.getChannelZValue(index);

		} else if (channel === 'f') {

			return this.getChannelFValue(index);

		} else {

			return null;

		}
	};

	TimeSeries.prototype.getChannelHValue = function(index){

		return this.get('h')[index];
	};

	TimeSeries.prototype.getChannelEValue = function(index){

		return this.get('e')[index];
	};

	TimeSeries.prototype.getChannelZValue = function(index){

		return this.get('z')[index];
	};

	TimeSeries.prototype.getChannelFValue = function(index){

		return this.get('f')[index];
	};


	return TimeSeries;

});
