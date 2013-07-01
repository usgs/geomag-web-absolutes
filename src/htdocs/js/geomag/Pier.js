/*global define*/

define([
	'mvc/Model',
	'mvc/Util'
], function (
	Model,
	Util
) {
	'use strict';


	/** Define default attributes */
	var DEFAULTS = {
		'id': null,
		'name': null,
		'begin': null,
		'end': null,
		'correction': null,
		'default_mark_id': null,
		'default_electronics_id': null,
		'default_theodolite_id': null,
		'marks': null
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


	/**
	 * Get the default mark for the pier.
	 *
	 * @return {Mark} the default mark, or null if no default is specified.
	 */
	Pier.prototype.getDefaultMark = function () {
		var marks = this.get('marks'),
			default_mark_id = this.get('default_mark_id');
		if (marks !== null && default_mark_id !== null) {
			return marks.get(default_mark_id);
		} else {
			return null;
		}
	};


	// return constructor from closure
	return Pier;
});
