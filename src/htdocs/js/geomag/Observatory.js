/*global define*/

define([
	'mvc/Model',
	'util/Util'
], function(
	Model,
	Util
) {
	'use strict';


	/** Define default attributes. */
	var DEFAULTS = {
		'id': null,
		'code': null,
		'name': null,
		'location': null,
		'latitude': null,
		'longitude': null,
		'geomagnetic_latitude': null,
		'geomagnetic_longitude': null,
		'elevation': null,
		'orientation': null,
		'instruments': null,
		'piers': null,
		'default_pier_id': null
	};


	/**
	 * Constructor.
	 *
	 * @param  options {Object} observatory attributes.
	 */
	var Observatory = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
	};

	// Observatory extends Model
	Observatory.prototype = Object.create(Model.prototype);


	/**
	 * Get the default pier for this observatory.
	 *
	 * @return {Pier} the default pier, or null if no default is specified.
	 */
	Observatory.prototype.getDefaultPier = function () {
		var piers = this.get('piers'),
		    default_pier_id = this.get('default_pier_id');
		if (piers !== null && default_pier_id !== null) {
			return piers.get(default_pier_id);
		} else {
			return null;
		}
	};


	// return constructor from closure
	return Observatory;
});
