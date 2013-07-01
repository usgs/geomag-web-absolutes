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

	var Instrument = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	Instrument.prototype = Object.create(Model.prototype);

	return Instrument;
});
