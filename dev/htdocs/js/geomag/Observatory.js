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
		'code': null,
		'name': null,
		'piers': null,
		'equipment': null
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


	// return constructor from closure
	return Observatory;
});
