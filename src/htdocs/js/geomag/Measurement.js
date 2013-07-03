/*global define*/

define([
	'mvc/Model',
	'mvc/Util'
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
		'angle': null
	};

	/**
	 * Constructor.
	 *
	 * @param  options {Object} observatory attributes.
	 */
	var Measurement	 = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
	};

	// Observatory extends Model
	Measurement.prototype = Object.create(Model.prototype);

	Measurement.FIRST_MARK_UP = 'first_mark_up';
	Measurement.FIRST_MARK_DOWN = 'first_mark_down';
	Measurement.WEST_DOWN = 'west_down';
	Measurement.EAST_DOWN = 'east_down';
	Measurement.WEST_UP = 'west_up';
	Measurement.EAST_UP = 'east_up';
	Measurement.SECOND_MARK_UP = 'second_mark_up';
	Measurement.SECOND_MARK_DOWN = 'second_mark_down';
	Measurement.SOUTH_DOWN = 'south_down';
	Measurement.NORTH_UP = 'north_up';
	Measurement.SOUTH_UP = 'south_up';
	Measurement.NORTH_DOWN = 'north_down';

	// return constructor from closure
	return Measurement;
});
