/* global define */
define([
	'mvc/Model',
	'util/Util',

	'CurrentUser'
], function (
	Model,
	Util,

	CurrentUser
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

	// static reference to currently logged in user
	var CURRENT_USER = null;


	/**
	 * Construct a new User object.
	 */
	var User = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	// User extends Model
	User.prototype = Object.create(Model.prototype);


	/**
	 * Static access to current user object.
	 *
	 * @return currently logged in user.
	 */
	User.getCurrentUser = function () {
		if (CURRENT_USER === null) {
			CURRENT_USER = new User(CurrentUser);
		}
		return CURRENT_USER;
	};

	return User;
});
