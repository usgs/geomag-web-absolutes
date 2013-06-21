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


	/**
	 * Get the observatory code.
	 *
	 * @return {String} observatory code.
	 */
	Observatory.prototype.getCode = function () {
		return this.get('code');
	};

	/**
	 * Set the observatory code.
	 *
	 * @param  code {String} code to set.
	 */
	Observatory.prototype.setCode = function (code) {
		this.set({'code':code});
	};

	/**
	 * Get the name.
	 * @return {String} observatory name.
	 */
	Observatory.prototype.getName = function () {
		return this.get('name');
	};

	/**
	 * Set the observatory name.
	 *
	 * @param  name {String} name to set.
	 */
	Observatory.prototype.setName = function (name) {
		this.set({'name':name});
	};

	/**
	 * Get the observatory piers.
	 *
	 * @return {Array<Pier>} observatory piers.
	 */
	Observatory.prototype.getPiers = function() {
		return this.get('piers');
	};

	/**
	 * Set all the observatory piers.
	 *
	 * @param  piers {Array<Pier>} piers to set.
	 */
	Observatory.prototype.setPiers = function(piers) {
		return this.set({'piers': piers});
	};

	/**
	 * Get the observatory equipment.
	 *
	 * @return {Array<Equipment>} observatory equipment.
	 */
	Observatory.prototype.getEquipment = function() {
		return this.get('equipment');
	};

	/**
	 * Set all the observatory equipment.
	 *
	 * @param  equipment {Array<Equipment>} equipment to set.
	 */
	Observatory.prototype.setEquipment = function(equipment) {
		return this.set({'equipment': equipment});
	};


	// return constructor from closure
	return Observatory;
});
