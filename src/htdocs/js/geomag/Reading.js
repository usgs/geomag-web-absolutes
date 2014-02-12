/*global define*/
define([
	'mvc/Model',
	'mvc/Collection',
	'util/Util',

	'geomag/Measurement'
], function (
	Model,
	Collection,
	Util,

	Measurement
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
		this._initialize();
	};
	// Reading extends Model
	Reading.prototype = Object.create(Model.prototype);


	Reading.prototype._initialize = function () {
		var _this = this,
		    measurements = this.get('measurements'),
		    data = null,
		    i = null,
		    len = null,
		    onChangeHandler = null;

		if (measurements === null) {
			measurements = new Collection([
				new Measurement({type: Measurement.FIRST_MARK_UP}),
				new Measurement({type: Measurement.FIRST_MARK_DOWN}),
				new Measurement({type: Measurement.WEST_DOWN}),
				new Measurement({type: Measurement.EAST_DOWN}),
				new Measurement({type: Measurement.WEST_UP}),
				new Measurement({type: Measurement.EAST_UP}),
				new Measurement({type: Measurement.SECOND_MARK_UP}),
				new Measurement({type: Measurement.SECOND_MARK_DOWN}),
				new Measurement({type: Measurement.SOUTH_DOWN}),
				new Measurement({type: Measurement.NORTH_UP}),
				new Measurement({type: Measurement.SOUTH_UP}),
				new Measurement({type: Measurement.NORTH_DOWN})
			]);

			this.set({'measurements': measurements});
		}

		data = measurements.data();
		len = data.length;

		onChangeHandler = function (evt) {
			_this.trigger('change:measurement', evt);
		};

		for (i = 0; i < len; i++) {
			data[i].on('change', onChangeHandler);
		}
	};

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
		var measurements = this.get('measurements'),
		    data,
		    measurement,
		    start,
		    end;

		if (measurements !== null) {
			data = measurements.data();

			measurement = data[0];
			start = measurement.get('time');
			end = start;

			for( var i = 0; i < data.length; i++) {
				measurement = data[i];
				if( measurement.get('time') < start )
					{ start = measurement.get('time'); }
				if (measurement.get('time') > end )
					{ end = measurement.get('time'); }
			}
		}

		return {'start':start, 'end': end};
	};

/*	Reading.prototype.getReadingTimes = function () {
		var measurements = this.getMeasurements();
		var measurement;
		var start = null, end = null;

		if( Object.keys(measurements)[0].length > 0) {
			measurement = measurements[Object.keys(measurements)[0]][0];
			start = measurement.get('time');
			end = start;
		}

		//for( type in measurements) {
		for( var type = 0; type < measurements.length; type++) {
			for( var i = 0; i < measurements[type].length; i++ ){
				measurement = measurements[type][i];
				if( measurement.get('time') < start )
					{ start = measurement.get('time'); }
				if( measurement.get('time') > end )
					{ end = measurement.get('time'); }
			}
		} 

	return {'start':start, 'end':end};
	}; */

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
