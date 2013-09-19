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
	//var DEFAULT_URL = 'http://ehpd-geomag.cr.usgs.gov/map/observatories_data.json.php';

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
	 * @param startend {Object}
	 * @param startend.start {epoch time}
	 * @param startend.end {epoch time}
	 * Sets RealTimeFactory's starttime and enddtime.
	 */
	RealtimeFactory.prototype._setStartEnd = function (startend) {
		if( this.options.starttime === null ) {
			this.options.starttime = startend.start;
		}
		else if ( this.options.starttime > startend.start ) {
			this.options.starttime = startend.start;
		}
		if( this.options.endtime === null ) {
			this.options.endtime = startend.end;
		}
		else if( this.options.endtime < startend.end ) {
			this.options.endtime = startend.end;
		}
	};

	/**
	 * Deprecated.
	 * Created to determine if we already loaded the data.
	 * If needed, we can add the code back into measurment/reading/observation.
	 */
	RealtimeFactory.prototype._checkDataExists = function (startend) {
		if( this.options.starttime === null || this.options.endtime === null ){
			return false;
		}
		if( this.options.data !== null ) {
			if( this.options.starttime < startend.start &&
			    this.options.endtime > startend.end){
				return false;
			}
		}
		return true;
	};

	/**
	 * @param reading {Object}
	 * @return starttime {Object}
	 * Loops through a reading and returns the start and end time.
	 */
	RealtimeFactory.prototype._getReadingStartEnd = function (reading) {
		var measurements = reading.get('measurements');
		var measurement_data = measurements.data();
		var start, end;

		if( measurement_data.length !== 0) {
			start = measurement_data[0].get('time');
			end = start;
		}

		for(var i = 0; i < measurement_data.length; i++) {
			var measurement = measurement_data[i];
			if( measurement.get('time') < start )
				{ start = measurement.get('time'); }
			if( measurement.get('time') > end )
				{ end = measurement.get('time'); }
		}

	return {'start':start, 'end':end};
	};

	/**
	 * @param measurement {Object}
	 * Sets h, e, z, f in a measurement
	 */
	RealtimeFactory.prototype._setMeasurementValues = function (measurement) {
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

	RealtimeFactory.prototype._setMeasurements = function (measurements, obj) {
		for( var i = 0; i < measurements.length; i++ ){
			var measurement = measurements[i];
			obj._setMeasurementValues(measurement);
		}
	};

	RealtimeFactory.prototype.getRealtimeDataByMeasurement = function(options) {
		var obj = this;
		var measurement = options.measurement;
		var success = options.success;
		var startend = {'start': measurement.get('time'),
		                'end': measurement.get('time') + 1};

		this._setStartEnd(startend);

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
	 * @arams options.success {function}
	 */
	RealtimeFactory.prototype.getRealtimeDataByReading = function (options) {
		var obj = this;
		var reading = options.reading;
		var success = options.success;
		var measurements = reading.get('measurements').data();

		var startend = this._getReadingStartEnd( options.reading );
		this._setStartEnd( startend );

		this.getRealtimeData({
			'starttime': this.options.starttime,
			'endtime': this.options.endtime,
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
	 */
	RealtimeFactory.prototype.getRealtimeDataByObservation = function (options) {
		var obj = this;
		var readings = options.observation.get('readings');
		var readingsData = readings.data();
		var obs = options.observation;
		var success = options.success;
		var begin = obs.get('begin');
		var end = obs.get('end');

		for(var i = 0; i < readingsData.length; i++ ) {
			var readingstartend = this._getReadingStartEnd( readingsData[i] );
			if( begin === null ) {
				begin = readingstartend.start;
			} else if( begin > readingstartend.start) {
				begin = readingstartend.start;
			}
			if( end === null ) {
				end = readingstartend.end;
			} else if( end < readingstartend.end) {
				end = readingstartend.end;
			}
		}
		obs.set({'begin':begin});
		obs.set({'end':end});

		this._setStartEnd( {'start': begin,'end': end} );

		this.getRealtimeData({
			'starttime': this.options.starttime,
			'endtime': this.options.endtime,
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


