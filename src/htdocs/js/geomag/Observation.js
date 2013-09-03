/* global define */
define([
	'mvc/Model',
	'util/Util'
], function (
	Model,
	Util
) {
	'use strict';

	var DEFAULTS = {
		'id': null,
		'begin': null,
		'end': null,
		'reviewer_user_id': null,
		'mark_id': null,
		'electronics_id': null,
		'theodolite_id': null,
		'pier_temperature': null,
		'elect_temperature': null,
		'flux_temperature': null,
		'proton_temperature': null,
		'annotation': null,
		'readings': null
	};

	var Observation = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	Observation.prototype = Object.create(Model.prototype);

	return Observation;
});
