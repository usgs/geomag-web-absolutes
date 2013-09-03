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

	// return constructor from closure
	return Reading;
});
