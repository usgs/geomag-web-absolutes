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
		'angle': null,
		'h': null,
		'e': null,
		'z': null,
		'f': null
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
