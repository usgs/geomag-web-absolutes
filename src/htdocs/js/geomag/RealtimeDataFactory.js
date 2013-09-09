/*global define*/
/*jshint unused:vars*/

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

	//var DEFAULT_URL = 'http://ehpd-geomag.cr.usgs.gov/map/observatories_data.json.php';
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
		this.options = Util.extend({}, DEFAULTS, options);
	};
	// RealtimeFactory extends Model
	RealtimeFactory.prototype = Object.create(Model.prototype);

	/**
	 * @param options {Object} observatory attributes.
	 *        options.  Same as constructor.
	 */
	RealtimeFactory.prototype.getRealtimeData = function(options) {
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
	 * @param reading {Object}
	 * Takes a reading object and increases/decreases starttime/endtime
	 * for the Factory if appropriate.
	 */
	RealtimeFactory.prototype._setReadingStartEnd = function(reading) {
		var measurements = reading.get('measurements');
		var measurement_data = measurements.data();

		if( measurement_data.length && this.options.starttime === null) {
			this.options.starttime  = measurement_data[0].get('time');
			this.options.endttime = this.options.starttime ;
		}

		for(var i = 0; i < measurement_data.length; i++) {
			var measurement = measurement_data[i];
			if( measurement.get('time') < this.options.starttime  )
				{ this.options.starttime  = measurement.get('time'); }
			if( measurement.get('time') > this.options.endttime )
				{ this.options.endttime = measurement.get('time'); }
		}
	};

	/**
	 * @param measurement {Object}
	 * Sets h, e, z, f in a measurement
	 */
	RealtimeFactory.prototype._setMeasurementValues = function(measurement) {
		var values = this.data.data[0].values;
		var timeoffset = measurement.get('time') - this.options.starttime;
		var tmph = values.H[timeoffset]; if( tmph === undefined ) { tmph = null; }
		var tmpe = values.E[timeoffset]; if( tmpe === undefined ) { tmpe = null; }
		var tmpz = values.Z[timeoffset]; if( tmpz === undefined ) { tmpz = null; }
		var tmpf = values.F[timeoffset]; if( tmpf === undefined ) { tmpf = null; }

		measurement.set({'h':tmph});
		measurement.set({'e':tmpe});
		measurement.set({'z':tmpz});
		measurement.set({'f':tmpf});
	};

	/**
	 * @params options {Object}
	 * @params options.readint {Object}
	 * @arams options.success {function}
	 */
	RealtimeFactory.prototype.getRealtimeDataByReading = function(options) {
		var obj = this;
		var reading = options.reading;
		var success = options.success;
		var measurements = reading.get('measurements').data();

		this._setReadingStartEnd( options.reading );

		this.getRealtimeData({
			'starttime': this.options.starttime,
			'endtime': this.options.endttime,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {
				obj.data = data;

				for( var i = 0; i < measurements.length; i++ ){
					var measurement = measurements[i];
					obj._setMeasurementValues(measurement);
				}
				success(reading);
			}
		});

	};

	/**
	 * @params options {Object}
	 * @params options.observation {Object}
	 * @params options.success {function}
	 */
	RealtimeFactory.prototype.getRealtimeDataByObservation = function(options) {
		var obj = this;
		var readings = options.observation.get('readings');
		var readingsData = readings.data();
		var obs = options.observation;
		var success = options.success;

		for(var i = 0; i < readingsData.length; i++ ) {
			var reading = readingsData[i];
			this._setReadingStartEnd(reading);
		}

		this.getRealtimeData({
			'starttime': this.options.starttime,
			'endtime': this.options.endttime,
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


