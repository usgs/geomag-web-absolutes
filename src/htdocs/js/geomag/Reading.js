/*global define*/

define([
	'mvc/Model',
	'util/Util'
], function (
	Model,
	Util
) {
	'use strict';

	/** Define default attributes. */
	var DEFAULTS = {
		'id': null,
		'set_number': null,
		'declination_valid': null,
		'horizontal_intensity_valid': null,
		'vertical_intensity_valid': null,
		'observer': null,
		'annotation': null,
		'measurements': null
	};

	/**
	 * Constructor.
	 *
	 * @param  options {Object} observatory attributes.
	 */
	var Reading = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
	};

	// Reading extends Model
	Reading.prototype = Object.create(Model.prototype);

	/**
	 * Get the Measurements for this reading.
	 *
	 * @return a key:array of type:[measurements]
	 *
	 * This is needed for future enhancements where we will have multiple measurements per type.
	 * So use this call so we don't have to refactor everything later.
	 */
	Reading.prototype.getMeasurements = function () {
		var measurements = this.get('measurements'),
		    r = {},
		    data,
		    m,
		    type,
		    i;

		if (measurements !== null) {
			data = measurements.data();

			for (i = 0; i < data.length; i++) {
				m = data[i];
				type = m.get('type');
				if (!r.hasOwnProperty(type)) {
					r[type] = [];
				}
				r[type].push(m);
			}
		}

		return r;
	};

	/**
	 * Get the starting and end time for this reading.
	 * @returns {object}
	 */
	Reading.prototype.getReadingTimes = function () {
		var measurements = this.getMeasurements();
		var measurement;
		var start = null, end = null;
		var type;

		if( Object.keys(measurements)[0].length > 0) {
			measurement = measurements[Object.keys(measurements)[0]][0];
			start = measurement.get('time');
			end = start;
		}

		for( type in measurements) {
			for( var i = 0; i < measurements[type].length; i++ ){
				measurement = measurements[type][i];
				if( measurement.get('time') < start )
					{ start = measurement.get('time'); }
				if( measurement.get('time') > end )
					{ end = measurement.get('time'); }
			}
		}

	return {'start':start, 'end':end};
	};

	/**
	 * @params options {Object}
	 * @params options.realtimeDataFactory {Object}
	 * @params options.success {function}
	 * Fills in HEZF for all the measurements in a reading.
	 * Not certain this will ever be used. Measurement and Observation
	 * should be the two used.
	 */
	Reading.prototype.setRealtimeData = function (options) {
		var realtimeDataFactory = options.realtimeDataFactory;
		var success = options.success;
		var measurements = this.get('measurements').data();
		var startend = this.getReadingTimes();
		var reading = this;

		realtimeDataFactory.getRealtimeData({
			'starttime': startend.start,
			'endtime': startend.end,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {

				for( var i = 0; i < measurements.length; i++ ){
					var measurement = measurements[i];
					measurement.setRealtimeValues(data);
				}
				success(reading);
			}
		});
	};

	// return constructor from closure
	return Reading;
});
