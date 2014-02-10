/*global define*/

define([
	'mvc/Model',
	'util/Util',
	'geomag/RealtimeDataFactory'
], function (
	Model,
	Util
) {
	'use strict';

	/** Define default attributes. */
	var DEFAULTS = {
		'id': null,
		'type': null,
		'time': null,
		'angle': null,
		'h': null,
		'e': null,
		'z': null,
		'f': null
	};

	/**
	 * Constructor.
	 *
	 * @param options {Object} Measurement attributes.
	 * @param options.id {int}
	 * @param options.type {string}
	 * @param options.time {epoch time}
	 * @param options.angle {float}
	 * @param options.h {float}
	 * @param options.e {float}
	 * @param options.z {float}
	 * @param options.f {float}
	 **/
	var Measurement	 = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
	};

	// Observatory extends Model
	Measurement.prototype = Object.create(Model.prototype);

	Measurement.prototype.setRealtimeValues = function (data) {
		var values = data.data[0].values;
		var timeoffset = this.get('time') - data.request.starttime;

		var tmph = values.H[timeoffset]; if( tmph === undefined ) { tmph = null; }
		var tmpe = values.E[timeoffset]; if( tmpe === undefined ) { tmpe = null; }
		var tmpz = values.Z[timeoffset]; if( tmpz === undefined ) { tmpz = null; }
		var tmpf = values.F[timeoffset]; if( tmpf === undefined ) { tmpf = null; }
		this.set({'h':tmph});
		this.set({'e':tmpe});
		this.set({'z':tmpz});
		this.set({'f':tmpf});
	};

	/**
	 * @params options {Object}
	 * @params options.realtimeDataFactory {Object}
	 * @params options.success {function}
	 * Fills in HEZF for the measurement.
	 */
	Measurement.prototype.setRealtimeData = function(options) {
		var realtimeDataFactory = options.realtimeDataFactory;
		var success = options.success;
		var measurement = this;

		realtimeDataFactory.getRealtimeData({
			'starttime': measurement.get('time'),
			'endtime': measurement.get('time') + 1,
			'channels': ['H','E','Z','F'],
			'freq': 'seconds',
			'success': function(data) {

			measurement.setRealtimeValues(data);
			success(measurement);
			}
		});
	};


	// These are in the same order as appear on the paper form.
	Measurement.FIRST_MARK_UP = 'FirstMarkUp';
	Measurement.FIRST_MARK_DOWN = 'FirstMarkDown';
	Measurement.WEST_DOWN = 'WestDown';
	Measurement.EAST_DOWN = 'EastDown';
	Measurement.WEST_UP = 'WestUp';
	Measurement.EAST_UP = 'EastUp';
	Measurement.SECOND_MARK_UP = 'SecondMarkUp';
	Measurement.SECOND_MARK_DOWN = 'SecondMarkDown';
	Measurement.SOUTH_DOWN = 'SouthDown';
	Measurement.NORTH_UP = 'NorthUp';
	Measurement.SOUTH_UP = 'SouthUp';
	Measurement.NORTH_DOWN = 'NorthDown';

	// return constructor from closure
	return Measurement;
});
