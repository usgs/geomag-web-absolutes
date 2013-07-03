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
		'name': null
	};

	var UserRole = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	UserRole.prototype = Object.create(Model.prototype);

	return UserRole;
});
