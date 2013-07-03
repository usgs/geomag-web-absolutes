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
		'username': null,
		'roles': null
	};

	var User = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};

	User.prototype = Object.create(Util.extend({}, Model.prototype, {
		hasRole: function (role) {
			var roles = this.get('roles'),
			    len = roles.length,
			    i = 0;

			// TODO :: Is "roles" a collection or an array?
			for (i = 0; i < len; i++) {
				if (roles[i].get('id') === role.get('id')) {
					return true;
				}
			}

			return false;
		}
	}));

	return User;
});
