/*global define*/

define([
	'mvc/Model',
	'mvc/Util'
], function(
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

	// return constructor from closure
	return Measurement;
});
