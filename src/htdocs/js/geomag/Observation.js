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
		'mark_id': null,
		'electronics_id': null,
		'theodolite_id': null,
		'pier_temperature': null,
		'elect_temperature': null,
		'flux_temperature': null,
		'proton_temperature': null,
		'annotation': null,
		'readings': null
	};

	var Observation = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
		if (this.get('readings') === null) {
			this.set({
				readings: new Collection([
						new Reading(),
						new Reading(),
						new Reading(),
						new Reading()
						])
			});
		}
	};
	Observation.prototype = Object.create(Model.prototype);

	Observation.prototype.getObservationTimes = function() {
		var readings = this.get('readings');
		var readingsData = readings.data();
		var begin = this.get('begin');
		var end = this.get('end');

		for(var i = 0; i < readingsData.length; i++ ) {
			var readingstartend = readingsData[i].getReadingTimes();
			if (begin === null) {
				begin = readingstartend.start;
			} else if (begin > readingstartend.start) {
				begin = readingstartend.start;
			}
			if (end === null) {
				end = readingstartend.end;
			} else if (end < readingstartend.end) {
				end = readingstartend.end;
			}
		}
		this.set({'begin':begin});
		this.set({'end':end});
		return({'start':begin, 'end':end});
	};

	/**
	 * @params options {Object}
	 * @params options.realtimeDataFactory {Object}
	 * @params options.success {function}
	 * Fills in HEZF for all the measurements in a observation.
	 * could be refactored to call reading.setRealtimeData, but that slows
	 * things down.
	 */
	Observation.prototype.setRealtimeData = function (options) {
		var realtimeDataFactory = options.realtimeDataFactory;
		var readings = this.get('readings');
		var readingsData = readings.data();
		var obs = this;
		var success = options.success;

		var startend = this.getObservationTimes();

		realtimeDataFactory.getRealtimeData({
			'starttime': startend.start,
			'endtime': startend.end,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {
				for( var j = 0; j < readingsData.length; j++ ) {
					var reading = readingsData[j];
					var measurements = reading.get('measurements');
					var measurement_data = measurements.data();
					for( var i = 0; i < measurement_data.length; i++ ){
						var measurement = measurement_data[i];
						measurement.setRealtimeValues(data);
					}
				}
				success(obs);
			}
		});
	};

	return Observation;
});
