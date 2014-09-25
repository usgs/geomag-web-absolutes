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
		'name': null,
		'username': null,
		'default_observatory_id': null,
		'email': null,
		'last_login': null,
		'admin': null,
		'enabled': null
	};

	var User = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	User.prototype = Object.create(Model.prototype);

	return User;
});
