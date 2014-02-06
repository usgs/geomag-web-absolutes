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
		'annotation': null,
		'readings': null
	};

	var Observation = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	Observation.prototype = Object.create(Model.prototype);

	return Observation;
});
