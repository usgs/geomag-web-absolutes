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
		'type': null,
		'time': null,
		'angle': 0,
		'h': null,
		'e': null,
		'z': null,
		'f': null,
		'time_error':null,
		'angle_error':null,
		'degrees_error':null,
		'minutes_error':null,
		'seconds_error':null
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


	/**
	 * Set realtime data values corresponding to measurement time.
	 *
	 * @param realtimeData {RealtimeData}
	 *        as returned by RealtimeDataFactory.
	 */
	Measurement.prototype.setRealtimeData = function (realtimeData) {
		var values = realtimeData.getValues(this.get('time')),
		    toset;
		toset = {
			h: null,
			e: null,
			z: null,
			f: null
		};
		if (values !== null) {
			toset.h = values.H;
			toset.e = values.E;
			toset.z = values.Z;
			toset.f = values.F;
		}
		this.set(toset);
	};

	Measurement.prototype.getErrors = function () {
		var errors = [];

		if (this.get('time_error') !== null) {
			errors.push(this.get('time_error'));
		}

		if (this.get('degrees_error') !== null) {
			errors.push(this.get('degrees_error'));
		}

		if (this.get('minutes_error') !== null) {
			errors.push(this.get('minutes_error'));
		}

		if (this.get('seconds_error') !== null) {
			errors.push(this.get('seconds_error'));
		}

		return errors;
	};

	// this is separate so that the number of errors is based off of
	// the number of invalid user-entered values
	Measurement.prototype.setAngleError = function () {
		var error = false;

		if (this.get('degrees_error') !== null) {
			error = true;
		} else if (this.get('minutes_error') !== null) {
			error = true;
		} else if (this.get('seconds_error') !== null) {
			error = true;
		}

		if (error) {
			this.set({'angle_error': 'Invalid Angle. Check Deg, Min, Sec values.'});
		} else {
			this.set({'angle_error': null });
		}
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
