
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
		'pier_name': null,
		'begin': null,
		'correction': null,
		'default_mark_id': null,
		'default_electronics_id': null,
		'default_theodolite_id': null
	};

  
	/**
	 * Constructor.
	 *
	 * @param  options {Object} pier attributes.
	 */
	var Pier = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
	};

	// Pier extends Model
	Pier.prototype = Object.create(Model.prototype);



	// return constructor from closure
	return Pier;
});
