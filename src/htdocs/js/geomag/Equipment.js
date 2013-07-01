/* global define */
define([
	'mvc/Model',
	'mvc/Util'
], function (
	Model,
	Util
) {
	'use strict';

	var DEFAULTS = {
		'id': null,
		'name': null,
		'type': null,
		'serial_number': null,
		'begin': null,
		'end': null
	};

	var Equipment = function (attributes) {
		Model.apply(this, [Util.extend({}, DEFAULTS, attributes)]);
	};
	Equipment.prototype = Object.create(Model.prototype);
});
