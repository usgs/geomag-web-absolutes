/*global define*/

define([
	'mvc/Model',
	'mvc/Collection',
	'mvc/Util'
], function(
	Model,
	Util
) {
	'use strict';


	/** Define default attributes. */
	var DEFAULTS = {
		'id': null,
		'set_number': null,
		'mark_id': null,
		'electronics_id': null,
		'theodolite_id': null,
		'temperature': null,
		'declination_valid': null,
		'horizontal_intensity_valid': null,
		'vertical_intensity_valid': null,
		'observer': null,
		'annotation': null,
		'measurements': null,
		'timeseries':null
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

	// return constructor from closure
	return Reading;
});
