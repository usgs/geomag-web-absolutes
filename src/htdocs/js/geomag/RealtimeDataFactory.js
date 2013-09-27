/*global define*/

define([
	'mvc/Model',
	'mvc/Util',
	'geomag/Reading.js',
	'mvc/Xhr'
], function (
	Model,
	Util,
	Reading,
	Xhr
) {
	'use strict';

	var DEFAULT_URL = '/map/observatories_data.json.php';

	/** Define default attributes. */
	var DEFAULTS = {
		'url': DEFAULT_URL,
		'starttime': null,
		'endtime': null,
		'channels': ['H','E','Z','F'],
		'freq': 'seconds',
		'data': null
	};


	/**
	 * Constructor.
	 *
	 * @param options {Object} observatory attributes.
	 * @param options.url {string}
	 * @param options.channels {Array<string>}
	 * @param options.observatory {Array{string}}
	 * @param options.freq {string{seconds|minutes}}
	 * @param options.success {callback()}
	 */
	var RealtimeFactory = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
		this.options = Util.extend({}, DEFAULTS, options);
	};
	// RealtimeFactory extends Model
	RealtimeFactory.prototype = Object.create(Model.prototype);

	/**
	 * @param options {Object} observatory attributes.
	 *        options.???  Same as constructor.
	 */
	RealtimeFactory.prototype.getRealtimeData = function (options) {
		options = Util.extend( {}, this.options, options);

		Xhr.jsonp({
			'url': options.url,
			data: {
				'starttime': options.starttime,
				'endtime': options.endtime,
				'obs[]': options.observatory,
				'chan[]': options.channels,
				'freq': options.freq
			},
			'success': options.success
		});
	};

	/**
	 * @param measurement {Object}
	 * Sets h, e, z, f in a measurement
	 */
	RealtimeFactory.prototype._setMeasurementValues = function (measurement) {
		var values = this.data.data[0].values;
		var timeoffset = measurement.get('time') - this.data.request.starttime;

		var tmph = values.H[timeoffset]; if( tmph === undefined ) { tmph = null; }
		var tmpe = values.E[timeoffset]; if( tmpe === undefined ) { tmpe = null; }
		var tmpz = values.Z[timeoffset]; if( tmpz === undefined ) { tmpz = null; }
		var tmpf = values.F[timeoffset]; if( tmpf === undefined ) { tmpf = null; }
		measurement.set({'h':tmph});
		measurement.set({'e':tmpe});
		measurement.set({'z':tmpz});
		measurement.set({'f':tmpf});
	};

	RealtimeFactory.prototype._setMeasurements = function (measurements, obj) {
		for( var i = 0; i < measurements.length; i++ ){
			var measurement = measurements[i];
			obj._setMeasurementValues(measurement);
		}
	};

	/**
	 * @params options {Object}
	 * @params options.measurement {Object}
	 * @params options.success {function}
	 * Fills in HEZF on a single measurement object.
	 */
	RealtimeFactory.prototype.getRealtimeDataByMeasurement = function(options) {
		var obj = this;
		var measurement = options.measurement;
		var success = options.success;

		this.getRealtimeData({
			'starttime': measurement.get('time'),
			'endtime': measurement.get('time') + 1,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {
				obj.data = data;

				obj._setMeasurementValues(measurement);
				success(measurement);
			}
		});
	};

	/**
	 * @params options {Object}
	 * @params options.reading {Object}
	 * @params options.success {function}
	 * Fills in HEZF for all the measurements in a reading.
	 * Not certain this will ever be used. Measurement and Observation
	 *  should be the two used.
	 */
	RealtimeFactory.prototype.getRealtimeDataByReading = function (options) {
		var obj = this;
		var reading = options.reading;
		var success = options.success;
		var measurements = reading.get('measurements').data();
		var startend = reading.getReadingTimes();

		this.getRealtimeData({
			'starttime': startend.start,
			'endtime': startend.end,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {
				obj.data = data;

				obj._setMeasurements(measurements, obj);
				success(reading);
			}
		});
	};

	/**
	 * @params options {Object}
	 * @params options.observation {Object}
	 * @params options.success {function}
	 * Fills in HEZF for all the measurements in a observation.
	 */
	RealtimeFactory.prototype.getRealtimeDataByObservation = function (options) {
		var obj = this;
		var readings = options.observation.get('readings');
		var readingsData = readings.data();
		var obs = options.observation;
		var success = options.success;

		var startend = obs.getObservationTimes();

		this.getRealtimeData({
			'starttime': startend.start,
			'endtime': startend.end,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {
				obj.data = data;

				for( var j = 0; j < readingsData.length; j++ ) {
					var reading = readingsData[j];
					var measurements = reading.get('measurements');
					var measurement_data = measurements.data();
					for( var i = 0; i < measurement_data.length; i++ ){
						var measurement = measurement_data[i];
						obj._setMeasurementValues(measurement);
					}
				}
				success(obs);
			}
		});
	};

	// return constructor from closure
	return RealtimeFactory;
});


