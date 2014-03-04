
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
		'name': null,
		'begin': null,
		'end': null,
		'azimuth': null
	};

	/**
		* Constructor.
		*
		* @param  options {Object} observatory attributes.
		*/
	var Mark = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
	};

	// Mark extends Model
	Mark.prototype = Object.create(Model.prototype);

	// return constructor from closure
	return Mark;
});
